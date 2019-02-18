/**
 * @author Felix M�ller aka syl3r86
 * @version 0.1
 */

class BetterNPCActor5eSheet extends Actor5eSheet {
    constructor(app) {
        super(app);

        // setting to display either the Icon of the item (true) or a generic d20 icon (false)
        this.useFeatIcons = false;
        this.useWeaponIcons = false;
        this.useSpellIcons = false;

        // setting to determine the default state for the sheet
        this.editMode = false;

        // adding the #equals and #unequals handlebars helper
        Handlebars.registerHelper('equals', function (arg1, arg2, options) {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        });

        Handlebars.registerHelper('unequals', function (arg1, arg2, options) {
            return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
        });
    }

    get template() {
        const path = "public/systems/dnd5e/templates/actors/";
        if ( this.actor.data.type === "character" ) return path + "actor-sheet.html";
        else if (this.actor.data.type === "npc") return "public/modules/betternpcsheet5e/template/npc-sheet.html";
        else throw "Unrecognized Actor type " + this.actor.data.type;
    }

    getData() {
        let data = super.getData();
        data['useFeatIcons'] = this.useFeatIcons;
        data['useWeaponIcons'] = this.useWeaponIcons;
        data['useSpellIcons'] = this.useSpellIcons;
        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);
        if (this.actor.data.type === "character") {
            return;
        }

        // setting npcsheet width (depending on spells)
        let hasSpells = false;
        for (let item of this.actor.data.items) {
            if (item.type == 'spell' && item.data.level.value > 0) {
                hasSpells = true;
                break;
            }
        }
        let columnWidth = 290;
        if (hasSpells) {
            html.parent().parent().css('width', columnWidth*3).css('height', 'auto');
            html.find('.npc-sheet').css('width', columnWidth * 3);
            html.find('.body-tile').css('width', '33.3%');
        } else {
            html.parent().parent().css('width', columnWidth * 2).css('height', 'auto');
            html.find('.npc-sheet').css('width', columnWidth * 2);
            html.find('.body-tile').css('width', '50%');
        }

        // hide elements that are part of the edit mode
        if (this.editMode == false) {
            let hidable = html.find('.hidable');
            for (let obj of hidable) {
                let data = obj.getAttribute('data-hidable-attr');
                if (data == '' || data == 0) {
                    obj.style.display = 'none';
                }
            }
            html.find('.show-on-edit').hide();
        }

        // toggle edit mode button event
        html.find('.editBtn').click(e => {
            this.editMode = !this.editMode;
            let hidable = html.find('.hidable');
            for (let obj of hidable) {
                let data = obj.getAttribute('data-hidable-attr');
                if (data == '' || data == 0) {
                    if (this.editMode == false) {
                        obj.style.display = 'none';
                    } else {
                        obj.style.display = '';
                    }
                }
                //let hidableAttr = obj.getElementsByClassName('.hidable-attr');
            }
            if (this.editMode) {
                html.find('.show-on-edit').show();
                html.find('input').css('background', 'white');
            } else {
                html.find('.show-on-edit').hide();
                html.find('input').css('background', 'none');
            }
        });

        // set dynamic input width
        let inputs = html.find('.npc-textinput,.npc-textinput-small');
        inputs.keyup(e => {
            if (e.target.value != '') {
                e.target.style.width = e.target.value.length + 1 + 'ch';
            } else {
                e.target.style.width = e.target.placeholder.length + 'ch';
            }
        });
        inputs.change(e => {
            if (e.target.value != '') {
                e.target.style.width = e.target.value.length + 1 + 'ch';
            } else {
                e.target.style.width = e.target.placeholder.length + 'ch';
            }
        });
        inputs.trigger('change');

        // adding toggle for item detail
        html.find('.npc-item-name').click(e => {
            let itemId = e.target.getAttribute('data-item-id');
            let targetDesc = html.find('.item[data-item-id=' + itemId + '] .item-description');
            targetDesc.toggle(100);
        });

        html.find('.body-tile-name').click(e => {
            let target = e.target.getAttribute('data-tile');
            let collapsTarget = e.target.getAttribute('data-target') || 'item';
            let targetTile = html.find('.body-tile[data-tile=' + target + '] .' + collapsTarget);
            targetTile.toggle(100);
        });


        // hide spell details by default
        html.find('.spell-description').toggle();

        // remove window padding
        $('.npc-sheet').parent().css('padding', '0');
    }

    /**
    * Organize and classify Items for NPC sheets
    * @private
    */
    _prepareNPCItems(actorData) {

        // Features
        const features = [];

        // Weapons
        const weapons = [];

        // Spellbook
        const spellbook = {};

        // Iterate through items, allocating to containers
        for (let i of actorData.items) {
            i.img = i.img || DEFAULT_TOKEN;

            // Spells
            if (i.type === "spell") {
                let lvl = i.data.level.value || 0;
                spellbook[lvl] = spellbook[lvl] || {
                    isCantrip: lvl === 0,
                    label: CONFIG.spellLevels[lvl],
                    spells: [],
                    uses: actorData.data.spells["spell" + lvl].value || 0,
                    slots: actorData.data.spells["spell" + lvl].max || 0
                };
                i.data.school.str = CONFIG.spellSchools[i.data.school.value];
                spellbook[lvl].spells.push(i);
            }

            // Features
            else if (i.type === "weapon") weapons.push(i);
            else if (i.type === "feat") features.push(i);
            else if (["equipment", "consumable", "tool", "backpack"].includes(i.type)) features.push(i);
        }

        // Assign the items
        actorData.features = features;
        actorData.spellbook = spellbook;
        actorData.weapons = weapons;
    }
    
    toggleEditMoed() {
        if (this.editMode == true) {
            for (let obj of html.find('.hidable')) {
                if (obj.querySelector('.hidable-attr') != undefined &&
                    (obj.querySelector('.hidable-attr').value == '' || obj.querySelector('.hidable-attr').value == 0)) {
                    obj.style.display = "none";
                }
            }
            html.find('.show-on-edit').hide(100);
            this.editMode = false;
        } else {
            for (let obj of html.find('.hidable')) {
                if (obj.querySelector('.hidable-attr') != undefined &&
                    (obj.querySelector('.hidable-attr').value == '' || obj.querySelector('.hidable-attr').value == 0)) {
                    obj.style.display = "inline-block";
                }
            }
            html.find('.show-on-edit').show(100);
            this.editMode = true;
        }
    }
}

// overwriting the default npc sheet
CONFIG.Actor.sheetClass = BetterNPCActor5eSheet;