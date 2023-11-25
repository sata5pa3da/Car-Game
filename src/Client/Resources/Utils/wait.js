function wait(seconds){
    return new Promise((res) => {
        setTimeout(() => {
            res();
        }, 1000 * seconds);
    });
}