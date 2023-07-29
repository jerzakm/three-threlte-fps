import type { V3, V3obj } from '$lib/util/types';
import type { RigidBody, Collider } from '@dimforge/rapier3d-compat';
import { useRapier } from '@threlte/rapier';
import { Vector3 } from 'three';

import { soundMap } from './soundSystem';
import { useGameData } from './_gameData';

const BULLET_FAR_CLEANUP = 1000;
const BULLET_MIN_SPEED_CLEANUP = 6;

export type BulletSpawnOptions = {
	origin: V3;
	target: V3;
	velocity: number;
	dropoff: number;
	userData?: any;
};

export const initBulletSystem = () => {
	const { rapier, world } = useRapier();

	const { bulletData } = useGameData();
	const { bulletPhysics, bulletImpacts } = bulletData;

	const colliderDesc = rapier.ColliderDesc.ball(0.1);

	const barrelDirection = new Vector3();
	const barrelStart = new Vector3();
	const barrelEnd = new Vector3();

	let availableIndex: undefined | number = undefined;

	const spawnBullet = (options: BulletSpawnOptions) => {
		barrelStart.set(...options.origin);
		barrelEnd.set(...options.target);

		barrelDirection.subVectors(barrelStart, barrelEnd).multiplyScalar(1200);
		const rigidBodyDesc = new rapier.RigidBodyDesc(rapier.RigidBodyType.Dynamic)
			.setTranslation(-1000, -1000, -1000)
			.setLinvel(0, 0, 0)
			.setUserData({
				type: 'bullet'
			})
			.setGravityScale(0)
			.setCanSleep(false)
			.setCcdEnabled(true);
		rigidBodyDesc
			.setTranslation(...options.origin)
			.setLinvel(barrelDirection.x, barrelDirection.y, barrelDirection.z)
			.setGravityScale(options.dropoff);

		const body = world.createRigidBody(rigidBodyDesc);
		const collider = world.createCollider(colliderDesc, body);

		if (availableIndex) {
			bulletPhysics[availableIndex] = {
				body,
				collider
			};
		} else {
			bulletPhysics.push({
				body,
				collider
			});
		}
	};

	let updateCount = 0;
	const cleanup = () => {
		updateCount++;
		availableIndex = undefined;
		for (let i = 0; i < bulletPhysics.length; i++) {
			const bullet = bulletPhysics[i];

			if (bullet) {
				// Clean up if too far
				let cleanup = false;
				if (updateCount % 50 === 0 && !cleanup) {
					const { x, y, z } = bullet.body.translation();
					if (
						Math.abs(x) > BULLET_FAR_CLEANUP ||
						Math.abs(y) > BULLET_FAR_CLEANUP ||
						Math.abs(z) > BULLET_FAR_CLEANUP
					) {
						cleanup = true;
					}
				}
				// Clean up if too slow
				if (updateCount % 20 === 0 && !cleanup) {
					const { x, y, z } = bullet.body.linvel();
					const speed = Math.abs(x) + Math.abs(y) + Math.abs(z);
					if (speed < BULLET_MIN_SPEED_CLEANUP) {
						cleanup = true;
					}
				}

				if (cleanup) {
					world.removeRigidBody(bullet.body);
					world.removeCollider(bullet.collider, false);
					bulletPhysics[i] = undefined;
				}
			} else {
				availableIndex = i;
			}
		}
	};

	const update = () => {
		for (let i = 0; i < bulletPhysics.length; i++) {
			const bullet = bulletPhysics[i];

			if (bullet) {
				world.contactsWith(bullet.collider, (otherCollider) => {
					const position = bullet.collider.translation();

					if (!bullet.body.userData) {
						bullet.body.userData = {};
					}

					const userData: any = bullet.body.userData;

					if (userData.impacted !== true) {
						// TODO RICOCHET???
						const linvel = bullet.body.linvel();
						bullet.body.setLinvel(
							{ x: linvel.x * 0.03, y: linvel.y * 0.03, z: linvel.z * 0.03 },
							true
						);
						bullet.body.setLinearDamping(2);
						userData.impacted = true;
						bulletImpacts.push({
							position,
							playedSound: false,
							sound: soundMap.impactDefault
						});
					}
					bullet.body.userData = userData;
				});
			}
		}
	};

	return { spawnBullet, cleanup, update };
};

export type BulletSystem = ReturnType<typeof initBulletSystem>;

export type BulletPhysics =
	| {
			body: RigidBody;
			collider: Collider;
	  }
	| undefined;

export type BulletImpact = {
	position: V3obj;
	playedSound: boolean;
	sound: string;
};
