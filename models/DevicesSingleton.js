
class DevicesSingleton {

    constructor() {
        throw new Error('Use Singleton.getInstance()');
    }

    static getInstance() {
        if (!DevicesSingleton.instance) {
            DevicesSingleton.instance =  new Map();
        }
        return DevicesSingleton.instance;
    }
}

module.exports = DevicesSingleton;