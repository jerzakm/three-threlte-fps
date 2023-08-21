varying vec2 custom_vUv;
uniform float progress;
uniform float iTime;

void main() {

  vec2 mUv = custom_vUv;
  // mUv.x *= progress + 1.;
  // mUv.x -= progress;
  // mUv.x -= progress;

  // Scale uv

  vec2 smokeUv = mUv;

  smokeUv.y -= 0.5;
  smokeUv.y *= (progress + 1.3);
  smokeUv.y = smokeUv.y * 0.5 + 0.5;

  // smokeUv.x -= 0.4;
  // smokeUv.x *= (progress + 1.3);
  // smokeUv.x = smokeUv.x * 0.5 + 0.5;

  vec4 smokeMap = texture2D(map, smokeUv);

  vec4 initial = texture2D(map, mUv);
  float red = initial.r;
  float green = initial.g;
  float blue = initial.b;

  // float smoke = (smokeMap.r - red) * 0.2;
  // float smoke = mUv.x * 0.08 * smokeMap.r;
  float smoke = (smokeMap.r - red) * 0.5 * mUv.x;

  vec3 rgb = vec3(red, green, blue) * 2.3;
  rgb = max(rgb, smoke);
  float a = clamp(red * 10., 0., 1.);
  // float smokeA = mUv.x * 0.28 * (smokeMap.r - red * 3.);

  // vec3 rgbMix = mix(vec3(smoke), rgb, clamp(progress * 3. - 1.5, 0., 1.));

  vec3 rgbMix = mix(vec3(smoke), rgb, clamp((progress), 0., 1.));

  a = clamp((rgbMix.r + smoke), 0., 1.);

  // float aMix = mix(a, smokeA, 0.);

  // a = 1.;
  csm_DiffuseColor = vec4(rgbMix, a * progress * 10.);
  // csm_DiffuseColor = vec4(rgbMix, pow(rgbMix.r, 1.));

}