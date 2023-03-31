class Component {
    constructor() {
        if (new.target === Component) {
            throw new Error("Class Error")
        };
    };

    render() {
        throw new Error("Error");
    };
};        

export default Component;