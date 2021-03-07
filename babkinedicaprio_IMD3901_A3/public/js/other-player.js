// Component for visualizing other players
AFRAME.registerComponent('other-player', {
    schema: {
        color: {type: 'color', default: 'grey'}
    },
    init: function() {
        this.el.setAttribute('geometry', {
            primitive: 'box',
            height: 1.6,
            depth: 0.5
        });
        this.el.setAttribute('material', {
            color: this.data.color
        });
    }
});