varying vec2 custom_vUv;
uniform sampler2D sight;
uniform sampler2D scene;

vec2 computeUV(vec2 uv, float k, float kcube) {

  vec2 t = uv - .5;
  float r2 = t.x * t.x + t.y * t.y;
  float f = 0.;

  if(kcube == 0.0) {
    f = 1. + r2 * k;
  } else {
    f = 1. + r2 * (k + kcube * sqrt(r2));
  }

  vec2 nUv = f * t + .5;

  return nUv;

}

void main() {
  vec2 rUv = custom_vUv * 3.;
  vec4 reticle = texture2D(sight, vec2(rUv.x - 1., 2. - rUv.y)) * 1.;

  float k = -0.4;
  float kcube = 1.4;
  float offset = .12;

  float red = texture2D(scene, computeUV(custom_vUv, k + offset, kcube)).r * 1.4;
  float green = texture2D(scene, computeUV(custom_vUv, k, kcube)).g * 1.4;
  float blue = texture2D(scene, computeUV(custom_vUv, k - offset, kcube)).b * 1.4;

  red = mix(red, reticle.r * 1.3, reticle.a);
  green = mix(green, 0.02, reticle.a);
  blue = mix(blue, 0., reticle.a);

  vec4 cubed = vec4(red, green, blue, 1.);

  csm_DiffuseColor = cubed;
}