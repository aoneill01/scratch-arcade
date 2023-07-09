export class LocalCloudProvider {
    constructor(vm, id) {
        this.id = id;
        this.data = JSON.parse(window.localStorage.getItem(id) ?? "{}");
        for (const [name, value] of Object.entries(this.data)) {
            vm.postIOData("cloud", { varUpdate: { name, value } });
        }
    }

    createVariable(name, value) {
        this.data[name] = value;
        this.save();
    }

    updateVariable(name, value) {
        this.data[name] = value;
        this.save();
    }

    renameVariable(oldName, newName) {
        this.data[newName] = this.data[oldName];
        delete this.data[oldName];
        this.save();
    }

    deleteVariable(name) {
        delete this.data[oldName];
        this.save();
    }

    requestCloseConnection() {
    }

    save() {
        window.localStorage.setItem(this.id, JSON.stringify(this.data));
    }
};
