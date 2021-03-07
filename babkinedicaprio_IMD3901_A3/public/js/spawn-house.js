AFRAME.registerComponent('spawn-house', {
    multiple: false,
    init: function() {
        // Allows the use of "self" as "this" within the listener without binding.
        const SELF = this;

        // Add the click listener.
        SELF.el.addEventListener('click', function() {
            // Create box
            let houseEntity = document.createElement('a-entity');

            // Store scene in variable
            let sceneEntity = document.querySelector('a-scene');

            // Which button did the user press
            let thisButton = this.id;
                    
            if (thisButton == 'windows_house') {
                // Set spawned box attributes
                houseEntity.setAttribute('obj-model','obj: url(assets/windows_house.obj)');

                // Change its position
                houseEntity.setAttribute('position', {
                    x: -5,
                    y: 10,
                    z: 3
                });

            } else if (thisButton == 'chimney_house') {
                // Set spawned box attributes
                houseEntity.setAttribute('obj-model','obj: url(assets/chimney_house.obj)');

                // Change its position
                houseEntity.setAttribute('position', {
                    x: 0,
                    y: 10,
                    z: 3
                });
            }

            // Add physics
            houseEntity.setAttribute('dynamic-body', '');

            // Modify its scale
            houseEntity.setAttribute('scale', {
                x: 3,
                y: 3,
                z: 3
            });

            houseEntity.id = 'house';

            // Finally append it to the scene
            sceneEntity.appendChild(houseEntity);

        });// End of click event listener
    }
});