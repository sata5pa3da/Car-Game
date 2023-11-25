class Typewriter{

    constructor(obj, text, duration, easingStyle){
        const obj_elt = obj.GetObject();
        const tracker = {value:0};

        const Tween = TweenManager.addTween(tracker, GenerateUniqueId())
            .addMotions([{key: "value", target: text.length}], duration, easingStyle)
            .bindToUpdate("__Update", (tween, dt) => {
                obj_elt.html(text.substring(0, round(tracker.value)));
            });

        return Tween;
    }
}