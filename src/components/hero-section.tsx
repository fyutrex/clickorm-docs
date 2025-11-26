'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Button } from '@/components/ui/button'
import { Star, ArrowRight, BookOpen } from 'lucide-react'

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [starCount, setStarCount] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch GitHub star count
  useEffect(() => {
    if (!mounted) return
    
    fetch('https://api.github.com/repos/clickhouse/clickhouse-js')
      .then(res => res.json())
      .then(data => setStarCount(data.stargazers_count))
      .catch(() => setStarCount(null))
  }, [mounted])

  // Three.js Animation
  useEffect(() => {
    if (!containerRef.current || !mounted) return

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    const isLowPowerDevice = isMobile || navigator.hardwareConcurrency <= 4
    const devicePixelRatio = Math.min(
      window.devicePixelRatio || 1,
      isMobile ? 1.5 : 2
    )

    let scene: THREE.Scene
    let camera: THREE.OrthographicCamera
    let renderer: THREE.WebGLRenderer
    let material: THREE.ShaderMaterial
    let clock: THREE.Clock
    let animationId: number

    const mouse = new THREE.Vector2(0.5, 0.5)
    const targetMouse = new THREE.Vector2(0.5, 0.5)
    const cursorSphere3D = new THREE.Vector3(0, 0, 0)

    const settings = {
      sphereCount: isMobile ? 4 : 6,
      fixedTopLeftRadius: 0.8,
      fixedBottomRightRadius: 0.9,
      smallTopLeftRadius: 0.3,
      smallBottomRightRadius: 0.35,
      ambientIntensity: 0.12,
      diffuseIntensity: 1.2,
      specularIntensity: 2.5,
      specularPower: 3,
      fresnelPower: 0.8,
      backgroundColor: new THREE.Color(0x0a0a15),
      sphereColor: new THREE.Color(0x050510),
      lightColor: new THREE.Color(0xff1eb7), // ClickORM pink
      lightPosition: new THREE.Vector3(0.9, 0.9, 1.2),
      smoothness: 0.8,
      contrast: 1.6,
      fogDensity: 0.06,
      cursorGlowIntensity: 1.2,
      cursorGlowRadius: 2.2,
      cursorGlowColor: new THREE.Color(0xff1eb7),
      cursorRadiusMin: 0.08,
      cursorRadiusMax: 0.15,
      animationSpeed: 0.6,
      movementScale: 1.2,
      mouseSmoothness: 0.1,
      mergeDistance: 1.5,
    }

    function init() {
      scene = new THREE.Scene()
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
      camera.position.z = 1
      clock = new THREE.Clock()

      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile && !isLowPowerDevice,
        alpha: true,
        powerPreference: isMobile ? 'default' : 'high-performance',
      })

      const pixelRatio = Math.min(devicePixelRatio, isMobile ? 1.5 : 2)
      renderer.setPixelRatio(pixelRatio)

      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      renderer.setSize(viewportWidth, viewportHeight)
      renderer.setClearColor(0x000000, 0)
      renderer.outputColorSpace = THREE.SRGBColorSpace

      const canvas = renderer.domElement
      canvas.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        max-width: 100vw !important;
        max-height: 100vh !important;
        z-index: 0 !important;
        display: block !important;
      `
      containerRef.current?.appendChild(canvas)

      material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2(viewportWidth, viewportHeight) },
          uActualResolution: {
            value: new THREE.Vector2(
              viewportWidth * pixelRatio,
              viewportHeight * pixelRatio
            ),
          },
          uPixelRatio: { value: pixelRatio },
          uMousePosition: { value: new THREE.Vector2(0.5, 0.5) },
          uCursorSphere: { value: new THREE.Vector3(0, 0, 0) },
          uCursorRadius: { value: settings.cursorRadiusMin },
          uSphereCount: { value: settings.sphereCount },
          uFixedTopLeftRadius: { value: settings.fixedTopLeftRadius },
          uFixedBottomRightRadius: { value: settings.fixedBottomRightRadius },
          uSmallTopLeftRadius: { value: settings.smallTopLeftRadius },
          uSmallBottomRightRadius: { value: settings.smallBottomRightRadius },
          uSmoothness: { value: settings.smoothness },
          uAmbientIntensity: { value: settings.ambientIntensity },
          uDiffuseIntensity: { value: settings.diffuseIntensity },
          uSpecularIntensity: { value: settings.specularIntensity },
          uSpecularPower: { value: settings.specularPower },
          uFresnelPower: { value: settings.fresnelPower },
          uBackgroundColor: { value: settings.backgroundColor },
          uSphereColor: { value: settings.sphereColor },
          uLightColor: { value: settings.lightColor },
          uLightPosition: { value: settings.lightPosition },
          uContrast: { value: settings.contrast },
          uFogDensity: { value: settings.fogDensity },
          uAnimationSpeed: { value: settings.animationSpeed },
          uMovementScale: { value: settings.movementScale },
          uCursorGlowIntensity: { value: settings.cursorGlowIntensity },
          uCursorGlowRadius: { value: settings.cursorGlowRadius },
          uCursorGlowColor: { value: settings.cursorGlowColor },
          uMergeDistance: { value: settings.mergeDistance },
          uIsMobile: { value: isMobile ? 1.0 : 0.0 },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          ${isMobile || isSafari || isLowPowerDevice ? 'precision mediump float;' : 'precision highp float;'}
          
          uniform float uTime;
          uniform vec2 uResolution;
          uniform vec2 uActualResolution;
          uniform float uPixelRatio;
          uniform vec2 uMousePosition;
          uniform vec3 uCursorSphere;
          uniform float uCursorRadius;
          uniform int uSphereCount;
          uniform float uFixedTopLeftRadius;
          uniform float uFixedBottomRightRadius;
          uniform float uSmallTopLeftRadius;
          uniform float uSmallBottomRightRadius;
          uniform float uMergeDistance;
          uniform float uSmoothness;
          uniform float uAmbientIntensity;
          uniform float uDiffuseIntensity;
          uniform float uSpecularIntensity;
          uniform float uSpecularPower;
          uniform float uFresnelPower;
          uniform vec3 uBackgroundColor;
          uniform vec3 uSphereColor;
          uniform vec3 uLightColor;
          uniform vec3 uLightPosition;
          uniform float uContrast;
          uniform float uFogDensity;
          uniform float uAnimationSpeed;
          uniform float uMovementScale;
          uniform float uCursorGlowIntensity;
          uniform float uCursorGlowRadius;
          uniform vec3 uCursorGlowColor;
          uniform float uIsMobile;
          
          varying vec2 vUv;
          
          const float PI = 3.14159265359;
          const float EPSILON = 0.001;
          const float MAX_DIST = 100.0;
          
          float smin(float a, float b, float k) {
            float h = max(k - abs(a - b), 0.0) / k;
            return min(a, b) - h * h * k * 0.25;
          }
          
          float sdSphere(vec3 p, float r) {
            return length(p) - r;
          }
          
          vec3 screenToWorld(vec2 normalizedPos) {
            vec2 uv = normalizedPos * 2.0 - 1.0;
            uv.x *= uResolution.x / uResolution.y;
            return vec3(uv * 2.0, 0.0);
          }
          
          float sceneSDF(vec3 pos) {
            float result = MAX_DIST;
            
            // Fixed spheres at different positions
            vec3 topLeftPos = screenToWorld(vec2(0.08, 0.92));
            float topLeft = sdSphere(pos - topLeftPos, uFixedTopLeftRadius);
            
            vec3 smallTopLeftPos = screenToWorld(vec2(0.25, 0.72));
            float smallTopLeft = sdSphere(pos - smallTopLeftPos, uSmallTopLeftRadius);
            
            vec3 bottomRightPos = screenToWorld(vec2(0.92, 0.08));
            float bottomRight = sdSphere(pos - bottomRightPos, uFixedBottomRightRadius);
            
            vec3 smallBottomRightPos = screenToWorld(vec2(0.72, 0.25));
            float smallBottomRight = sdSphere(pos - smallBottomRightPos, uSmallBottomRightRadius);
            
            float t = uTime * uAnimationSpeed;
            
            // Moving spheres
            int maxIter = uIsMobile > 0.5 ? 4 : min(uSphereCount, 10);
            for (int i = 0; i < 10; i++) {
              if (i >= uSphereCount || i >= maxIter) break;
              
              float fi = float(i);
              float speed = 0.4 + fi * 0.12;
              float radius = 0.12 + mod(fi, 3.0) * 0.06;
              float orbitRadius = (0.3 + mod(fi, 3.0) * 0.15) * uMovementScale;
              float phaseOffset = fi * PI * 0.35;
              
              vec3 offset = vec3(
                sin(t * speed + phaseOffset) * orbitRadius * 0.8,
                cos(t * speed * 0.85 + phaseOffset * 1.3) * orbitRadius * 0.6,
                sin(t * speed * 0.5 + phaseOffset) * 0.3
              );
              
              vec3 toCursor = uCursorSphere - offset;
              float cursorDist = length(toCursor);
              if (cursorDist < uMergeDistance && cursorDist > 0.0) {
                float attraction = (1.0 - cursorDist / uMergeDistance) * 0.3;
                offset += normalize(toCursor) * attraction;
              }
              
              float movingSphere = sdSphere(pos - offset, radius);
              result = smin(result, movingSphere, 0.05);
            }
            
            float cursorBall = sdSphere(pos - uCursorSphere, uCursorRadius);
            
            // Merge fixed spheres with smoothing
            float topLeftGroup = smin(topLeft, smallTopLeft, 0.4);
            float bottomRightGroup = smin(bottomRight, smallBottomRight, 0.4);
            
            result = smin(result, topLeftGroup, 0.3);
            result = smin(result, bottomRightGroup, 0.3);
            result = smin(result, cursorBall, uSmoothness);
            
            return result;
          }
          
          vec3 calcNormal(vec3 p) {
            float eps = 0.002;
            return normalize(vec3(
              sceneSDF(p + vec3(eps, 0, 0)) - sceneSDF(p - vec3(eps, 0, 0)),
              sceneSDF(p + vec3(0, eps, 0)) - sceneSDF(p - vec3(0, eps, 0)),
              sceneSDF(p + vec3(0, 0, eps)) - sceneSDF(p - vec3(0, 0, eps))
            ));
          }
          
          float rayMarch(vec3 ro, vec3 rd) {
            float t = 0.0;
            int maxSteps = uIsMobile > 0.5 ? 16 : 48;
            
            for (int i = 0; i < 48; i++) {
              if (i >= maxSteps) break;
              
              vec3 p = ro + rd * t;
              float d = sceneSDF(p);
              
              if (d < EPSILON) return t;
              if (t > 5.0) break;
              
              t += d * 0.9;
            }
            
            return -1.0;
          }
          
          vec3 lighting(vec3 p, vec3 rd, float t) {
            if (t < 0.0) return vec3(0.0);
            
            vec3 normal = calcNormal(p);
            vec3 viewDir = -rd;
            vec3 baseColor = uSphereColor;
            
            vec3 ambient = uLightColor * uAmbientIntensity;
            
            vec3 lightDir = normalize(uLightPosition);
            float diff = max(dot(normal, lightDir), 0.0);
            vec3 diffuse = uLightColor * diff * uDiffuseIntensity;
            
            vec3 reflectDir = reflect(-lightDir, normal);
            float spec = pow(max(dot(viewDir, reflectDir), 0.0), uSpecularPower);
            float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), uFresnelPower);
            
            vec3 specular = uLightColor * spec * uSpecularIntensity * fresnel;
            vec3 fresnelRim = uLightColor * fresnel * 0.4;
            
            vec3 color = baseColor + ambient + diffuse + specular + fresnelRim;
            color = pow(color, vec3(uContrast * 0.9));
            color = color / (color + vec3(0.8));
            
            return color;
          }
          
          float calculateCursorGlow(vec3 worldPos) {
            float dist = length(worldPos.xy - uCursorSphere.xy);
            float glow = 1.0 - smoothstep(0.0, uCursorGlowRadius, dist);
            glow = pow(glow, 2.0);
            return glow * uCursorGlowIntensity;
          }
          
          void main() {
            vec2 uv = (gl_FragCoord.xy * 2.0 - uActualResolution.xy) / uActualResolution.xy;
            uv.x *= uResolution.x / uResolution.y;
            
            vec3 ro = vec3(uv * 2.0, -1.0);
            vec3 rd = vec3(0.0, 0.0, 1.0);
            
            float t = rayMarch(ro, rd);
            vec3 p = ro + rd * t;
            vec3 color = lighting(p, rd, t);
            
            float cursorGlow = calculateCursorGlow(ro);
            vec3 glowContribution = uCursorGlowColor * cursorGlow;
            
            if (t > 0.0) {
              float fogAmount = 1.0 - exp(-t * uFogDensity);
              color = mix(color, uBackgroundColor.rgb, fogAmount * 0.3);
              color += glowContribution * 0.3;
              gl_FragColor = vec4(color, 1.0);
            } else {
              if (cursorGlow > 0.01) {
                gl_FragColor = vec4(glowContribution, cursorGlow * 0.8);
              } else {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
              }
            }
          }
        `,
        transparent: true,
      })

      const geometry = new THREE.PlaneGeometry(2, 2)
      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)

      // Event listeners
      window.addEventListener('mousemove', onPointerMove)
      window.addEventListener('resize', onWindowResize)

      // Initialize cursor position
      onPointerMove({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 } as MouseEvent)
    }

    function screenToWorldJS(normalizedX: number, normalizedY: number) {
      const uv_x = normalizedX * 2.0 - 1.0
      const uv_y = normalizedY * 2.0 - 1.0
      const aspect = window.innerWidth / window.innerHeight
      return new THREE.Vector3(uv_x * aspect * 2.0, uv_y * 2.0, 0.0)
    }

    function onPointerMove(event: MouseEvent) {
      targetMouse.x = event.clientX / window.innerWidth
      targetMouse.y = 1.0 - event.clientY / window.innerHeight

      const worldPos = screenToWorldJS(targetMouse.x, targetMouse.y)
      cursorSphere3D.copy(worldPos)
      
      // Calculate proximity to fixed spheres for dynamic radius
      const fixedPositions = [
        screenToWorldJS(0.08, 0.92), // top left
        screenToWorldJS(0.25, 0.72), // small top left
        screenToWorldJS(0.92, 0.08), // bottom right
        screenToWorldJS(0.72, 0.25)  // small bottom right
      ]

      let closestDistance = 1000.0
      fixedPositions.forEach((pos) => {
        const dist = cursorSphere3D.distanceTo(pos)
        closestDistance = Math.min(closestDistance, dist)
      })

      const proximityFactor = Math.max(0, 1.0 - closestDistance / settings.mergeDistance)
      const smoothFactor = proximityFactor * proximityFactor * (3.0 - 2.0 * proximityFactor)
      const dynamicRadius = settings.cursorRadiusMin + (settings.cursorRadiusMax - settings.cursorRadiusMin) * smoothFactor

      material.uniforms.uCursorSphere.value.copy(cursorSphere3D)
      material.uniforms.uCursorRadius.value = dynamicRadius
    }

    function onWindowResize() {
      const width = window.innerWidth
      const height = window.innerHeight
      const currentPixelRatio = Math.min(devicePixelRatio, isMobile ? 1.5 : 2)

      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      renderer.setPixelRatio(currentPixelRatio)

      material.uniforms.uResolution.value.set(width, height)
      material.uniforms.uActualResolution.value.set(
        width * currentPixelRatio,
        height * currentPixelRatio
      )
      material.uniforms.uPixelRatio.value = currentPixelRatio
    }

    function animate() {
      animationId = requestAnimationFrame(animate)
      
      // Smooth mouse movement
      mouse.x += (targetMouse.x - mouse.x) * settings.mouseSmoothness
      mouse.y += (targetMouse.y - mouse.y) * settings.mouseSmoothness

      material.uniforms.uTime.value = clock.getElapsedTime()
      material.uniforms.uMousePosition.value = mouse

      renderer.render(scene, camera)
    }

    init()
    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('mousemove', onPointerMove)
      window.removeEventListener('resize', onWindowResize)
      renderer.dispose()
      material.dispose()
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#0a0a15]">
      {/* Three.js Container */}
      <div ref={containerRef} className="absolute inset-0 z-0 w-full h-full overflow-hidden" />

      {/* Noise Overlay */}
      <div 
        className="absolute inset-0 z-[1] opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight tracking-tight">
            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-[#ff1eb7] via-[#ff1eb7] to-[#b537f2] animate-pulse">
              ClickORM
            </span>
            <br />
            <span className="text-white/90 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal mt-2 block">
              The High-Performance
              <br />
              ORM for ClickHouse
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 font-mono uppercase tracking-wider">
            TypeScript-native • Type-safe • Lightning-fast queries
            <br />
            <span className="text-sm text-white/40">
              Next-generation database abstraction layer
            </span>
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="group relative overflow-hidden bg-gradient-to-r from-[#ff1eb7] to-[#b537f2] hover:shadow-[0_0_30px_rgba(255,30,183,0.5)] transition-all duration-300 text-base sm:text-lg px-8 py-6 rounded-full"
              asChild
            >
              <a
                href="https://github.com/clickhouse/clickhouse-js"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Star className="w-5 h-5" />
                <span>Star on GitHub</span>
                {starCount && (
                  <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-sm">
                    {starCount.toLocaleString()}
                  </span>
                )}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="group border-2 border-white/20 hover:border-[#ff1eb7] hover:bg-white/5 backdrop-blur-sm text-white text-base sm:text-lg px-8 py-6 rounded-full transition-all duration-300"
              asChild
            >
              <a href="/docs" className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>Documentation</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-xs sm:text-sm text-white/40 font-mono uppercase tracking-widest">
            <p>Built for modern applications • Production-ready • Open Source</p>
            <div className="mt-4 flex items-center justify-center gap-4 text-xs">
              <a
                href="https://github.com/yourusername/clickorm/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 hover:text-brand-neon-pink transition-colors underline underline-offset-4"
              >
                MIT License
              </a>
              <span className="text-white/20">•</span>
              <a
                href="/privacy"
                className="text-white/30 hover:text-brand-neon-cyan transition-colors underline underline-offset-4"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[2]" />
    </section>
  )
}