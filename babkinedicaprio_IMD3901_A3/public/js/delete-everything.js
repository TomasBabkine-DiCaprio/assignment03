// Deletes all boxes in the scene
    AFRAME.registerComponent('delete-everything', {
        init: function() {
            // Allows the use of "self" as "this" within the listener without binding.
            const SELF = this;

            // Add the click listener.
            SELF.el.addEventListener('click', function() {
                // Store everything on the scene arrays
                let boxArray = document.querySelectorAll('#boxTemplate');
                let houseArray = document.querySelectorAll('#house');
                let holdArray = document.querySelectorAll('#heldBoxTemplate');

                // Store scene in variable
                let sceneEntity = document.querySelector('a-scene');

                // Loop through the arrays, delete all elements in the arrays
                for (var i = 0 ; i < boxArray.length ; i++) {
                    sceneEntity.removeChild(boxArray[i]);
                }
                for (var j = 0 ; j < houseArray.length ; j++) {
                    sceneEntity.removeChild(houseArray[j]);
                }
                for (var k = 0 ; k < holdArray.length ; k++) {
                    sceneEntity.removeChild(holdArray[k]);
                }

            }); // End of click event listener
        }
    });