// Handles players in the game
AFRAME.registerComponent('player-handler', {
    schema: {
        color: {type: 'color', default: 'grey'}
    },
    init: function() {
        var el = this.el;

        el.setAttribute('geometry', {
            primitive: 'box',
            height: 1.6,
            depth: 0.5
        });
        el.setAttribute('material', {
            color: this.data.color
        });
    }
});