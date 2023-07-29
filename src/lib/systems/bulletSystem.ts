import type { V3 } from '$lib/util/types';
import { useRapier } from '@threlte/rapier';
import { useSystem } from './gameSystems';
import { Vector3 } from 'three';

export type BulletSpawnOptions = {
	origin: V3;
	target: V3;
	velocity: number;
	dropoff: number;
	userData?: any;
};

export const initBulletSystem = () => {
	const { rapier, world } = useRapier();

	const colliderDesc = rapier.ColliderDesc.ball(0.1);
	const rigidBodyDesc = new rapier.RigidBodyDesc(rapier.RigidBodyType.Dynamic)
		.setTranslation(-1000, -1000, -1000)
		.setLinvel(0, 0, 0)
		.setUserData({
			type: 'bullet'
		})
		.setGravityScale(0)
		.setCanSleep(false)
		.setCcdEnabled(true);

	const barrelDirection = new Vector3();
	const barrelStart = new Vector3();
	const barrelEnd = new Vector3();

	const spawnBullet = (options: BulletSpawnOptions) => {
		barrelStart.set(...options.origin);
		barrelEnd.set(...options.target);

		barrelDirection.subVectors(barrelStart, barrelEnd).multiplyScalar(1200);

		rigidBodyDesc
			.setTranslation(...options.origin)
			.setLinvel(barrelDirection.x, barrelDirection.y, barrelDirection.z)
			.setGravityScale(options.dropoff);

		const rigidBody = world.createRigidBody(rigidBodyDesc);

		const collider = world.createCollider(colliderDesc, rigidBody);
	};

	return { spawnBullet };
};
