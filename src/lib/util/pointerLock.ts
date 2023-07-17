/* eslint-disable @typescript-eslint/ban-ts-comment */
/*
 * Pointer lock controls are chromium only (?).
 */
export const requestPointerLockWithUnadjustedMovement = (myTargetElement: HTMLElement) => {
	//@ts-ignore
	const promise = myTargetElement.requestPointerLock({
		unadjustedMovement: true
	});
	//@ts-ignore
	if (!promise) {
		console.log('disabling mouse acceleration is not supported, locking pointer without it');
		return;
	}

	return (
		promise
			//@ts-ignore
			.then(() => console.log('pointer is locked'))
			//@ts-ignore
			.catch((error) => {
				if (error.name === 'NotSupportedError') {
					// Some platforms may not support unadjusted movement.
					// You can request again a regular pointer lock.
					return myTargetElement.requestPointerLock();
				}
			})
	);
};
