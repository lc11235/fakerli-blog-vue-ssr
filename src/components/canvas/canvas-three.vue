<template>
    <div id="canvascontainer" class="back-three">
    </div>
</template>

<script lang="babel">
    const THREE = require('THREE');
    // const Stats = require('Stats');
    export default {
        name: 'canvsThree',
        mounted() {
            let SEPARATION = 100;
            let AMOUNTX = 50;
            let AMOUNTY = 50;
            let container;
            // let stats;
            let camera;
            let scene;
            let renderer;
            let particles;
            let particle;
            let count = 0;
            let mouseX = 0;
            let mouseY = 0;
            let windowHalfX = window.innerWidth / 2;
            let windowHalfY = window.innerHeight / 2;
            init();
            animate();
            function init() {
                container = document.getElementById('canvascontainer');
                // document.body.appendChild(container);
                camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
                camera.position.z = 1000;
                scene = new THREE.Scene();
                particles = [];
                let PI2 = Math.PI * 2;
                let material = new THREE.SpriteCanvasMaterial({
                    color: 0x0078de,
                    program: function (context) {
                        context.beginPath();
                        context.arc(0, 0, 0.5, 0, PI2, true);
                        context.fill();
                    }
                });
                let i = 0;
                for (let ix = 0; ix < AMOUNTX; ix++) {
                    for (let iy = 0; iy < AMOUNTY; iy++) {
                        particle = new THREE.Sprite(material);
                        particles[i++] = particle;
                        particle.position.x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
                        particle.position.z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
                        scene.add(particle);
                    }
                }
                renderer = new THREE.CanvasRenderer();
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.setSize(window.innerWidth, window.innerHeight);
                // 设置canvas的背景色，以及透明度。
                renderer.setClearColor(0x141a48, 1);
                container.appendChild(renderer.domElement);
                // three.js的性能监控插件，正式上线前将其屏蔽掉
                // stats = new Stats();
                // container.appendChild(stats.dom);
                document.addEventListener('mousemove', onDocumentMouseMove, false);
                document.addEventListener('touchstart', onDocumentTouchStart, false);
                document.addEventListener('touchmove', onDocumentTouchMove, false);
                //
                window.addEventListener('resize', onWindowResize, false);
            }
            function onWindowResize() {
                windowHalfX = window.innerWidth / 2;
                windowHalfY = window.innerHeight / 2;
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }
            //
            function onDocumentMouseMove(event) {
                mouseX = event.clientX - windowHalfX;
                mouseY = event.clientY - windowHalfY;
            }
            function onDocumentTouchStart(event) {
                if (event.touches.length === 1) {
                    event.preventDefault();
                    mouseX = event.touches[0].pageX - windowHalfX;
                    mouseY = event.touches[0].pageY - windowHalfY;
                }
            }
            function onDocumentTouchMove(event) {
                if (event.touches.length === 1) {
                    event.preventDefault();
                    mouseX = event.touches[0].pageX - windowHalfX;
                    mouseY = event.touches[0].pageY - windowHalfY;
                }
            }
            //
            function animate() {
                requestAnimationFrame(animate);
                render();
                // stats.update();
            }
            function render() {
                camera.position.x += (mouseX - camera.position.x) * 0.05;
                camera.position.y += (-mouseY - camera.position.y) * 0.05;
                camera.lookAt(scene.position);
                let i = 0;
                for (let ix = 0; ix < AMOUNTX; ix++) {
                    for (let iy = 0; iy < AMOUNTY; iy++) {
                        particle = particles[i++];
                        particle.position.y = (Math.sin((ix + count) * 0.3) * 50) +
                            (Math.sin((iy + count) * 0.5) * 50);
                        particle.scale.x = particle.scale.y = (Math.sin((ix + count) * 0.3) + 1) * 4 +
                            (Math.sin((iy + count) * 0.5) + 1) * 4;
                    }
                }
                renderer.render(scene, camera);
                count += 0.1;
            }
        }
    };
</script>