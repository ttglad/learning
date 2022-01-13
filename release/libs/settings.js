/*
 Copyright (c) 2011 Shyc2001 (http://twitter.com/shyc2001)
 This work is based on:
 *"Switchy! Chrome Proxy Manager and Switcher" (by Mohammad Hejazi (mohammadhi at gmail d0t com))
 *"SwitchyPlus" by @ayanamist (http://twitter.com/ayanamist)

 This file is part of SwitchySharp.
 SwitchySharp is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 SwitchySharp is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with SwitchySharp.  If not, see <http://www.gnu.org/licenses/>.
 */
var Settings = {};

Settings.configCache = {};

Settings.setValue = function setValue(key, value) {
    Settings.configCache[key] = value;

    var config = {};
    if (localStorage.config)
        config = JSON.parse(localStorage.config);

    config[key] = value;
    localStorage.config = JSON.stringify(config);
    return value;
};

Settings.getValue = function getValue(key, defaultValue) {
    if (typeof Settings.configCache[key] != "undefined")
        return Settings.configCache[key];

    if (!localStorage.config)
        return defaultValue;

    var config = JSON.parse(localStorage.config);
    if (typeof config[key] == "undefined")
        return defaultValue;

    Settings.configCache[key] = config[key];
    return config[key];
};

Settings.keyExists = function keyExists(key) {
    if (!localStorage.config)
        return false;

    var config = JSON.parse(localStorage.config);
    return (config[key] != undefined);
};

Settings.setObject = function setObject(key, object) {
    localStorage[key] = JSON.stringify(object);
    return object;
};


Settings.getObject = function getObject(key) {
    if (localStorage[key] == undefined)
        return undefined;

    return JSON.parse(localStorage[key]);
};

Settings.refreshCache = function refreshCache() {
    Settings.configCache = {};
};