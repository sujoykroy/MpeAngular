export class Scene {
    id;
    constructor(id:number) {
        this.id = id
    }

    equals(scene: Scene) {
        return scene && scene.id == this.id;
    }
}
