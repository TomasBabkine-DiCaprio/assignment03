// Spawns a box
AFRAME.registerComponent('spawn-block', {
    init: function() {
        // Allows the use of "self" as "this" within the listener without binding.
        const SELF = this;

        // Add the click listener.
        SELF.el.addEventListener('click', function() {
            // Create box
            let boxEntity = document.createElement('a-entity');

            // Store scene in variable
            let sceneEntity = document.querySelector('a-scene');

            // Set spawned box attributes
            // Geometry
            boxEntity.setAttribute('geometry', {
                primitive: 'box',
                height: 0.5,
                width: 0.5,
                depth: 0.5 
            });
            // Change its position
            boxEntity.setAttribute('position', {
                x: 5,
                y: 10,
                z: 3
            });
            // Change color
            boxEntity.setAttribute('material', 'color:red;');
            // Add physics
            boxEntity.setAttribute('dynamic-body', '');
            // This allows other boxes to be placed on top of it
            boxEntity.setAttribute('place-box', '');
            // Also give it a custom attribute for us to interact with it
            boxEntity.setAttribute('interact-box', '');
            
            // Give it an id
            boxEntity.id = "boxTemplate";

            // Finally append it to the scene
            sceneEntity.appendChild(boxEntity);

        });// End of click event listener
    }
});