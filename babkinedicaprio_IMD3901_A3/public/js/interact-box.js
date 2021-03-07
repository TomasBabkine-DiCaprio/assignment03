AFRAME.registerComponent('interact-box', {
    init: function () {
        // Retrieve scene
        let sceneEntity = document.querySelector('#sceneEntity');
        // Retrieve camera
        let cameraEntity = document.querySelector('#cameraId');
        const SELF = this.el;

        SELF.addEventListener('click', function(evt) {

            // Define whether or not player is already holding a block
            let holdingSomething = document.querySelector("#cameraId > #heldBoxTemplate");            
            
            if (holdingSomething === null) {
                // Remove old block
                sceneEntity.removeChild(SELF);

                // Create block, set its attributes append it to the camera
                const spawnedBox = document.createElement('a-entity');

                spawnedBox.setAttribute('geometry', {
                    primitive: 'box',
                    height: 0.5,
                    width: 0.5,
                    depth: 0.5
                });
                spawnedBox.setAttribute('position', {
                    x: -1,
                    y: 0,
                    z: -2
                });
                spawnedBox.setAttribute('rotation', {
                    x: 45,
                    y: 0,
                    z: 0
                });
                spawnedBox.setAttribute('material', {
                    color: 'red'
                });
                spawnedBox.id = 'heldBoxTemplate';

                // Finally play sound
                spawnedBox.setAttribute('sound', {
                    src: 'url(assets/grab.mp3)',
                    autoplay: true
                });

                cameraEntity.appendChild(spawnedBox);
            } else if (holdingSomething !== null) {
                // Get rid of the block the player is holding
                cameraEntity.removeChild(holdingSomething);

                // Place a new one, and give it physics 
                const spawnedBox = document.createElement('a-entity');

                spawnedBox.setAttribute('geometry', {
                    primitive: 'box',
                    height: 0.5,
                    width: 0.5,
                    depth: 0.5
                });
                spawnedBox.setAttribute('position', {
                    x: evt.detail.intersection.point.x,
                    y: evt.detail.intersection.point.y + 1,
                    z: evt.detail.intersection.point.z,
                });

                spawnedBox.setAttribute('material', {
                    color: 'red'
                });
                spawnedBox.id = 'boxTemplate';
                spawnedBox.setAttribute('dynamic-body', '');
                spawnedBox.setAttribute('interact-box', '');
                
                
                // Finally play sound
                spawnedBox.setAttribute('sound', {
                    src: 'url(assets/place.mp3)',
                    autoplay: true
                });

                sceneEntity.appendChild(spawnedBox);
            }
        });
    }
});