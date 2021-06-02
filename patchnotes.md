## v0.10.0
 - fixed senses and movement informations
    - thanks @Paterno#1107 for contributing these
 - fixed an issue that certain things were not hidden properly on new npcs
 - made the whole spellbook section hidden when no spells exists for the npc
 - added Active Effects Controlls
 - fixed creature type display

## v0.9.1
 - fixed a bug that led to a race condition when trying to enable Better Rolls. The modules shoudld now correctly work together

## v0.9
 - fixed BetterRolls integration for BetterRolls 1.1.17
 - added german translation, thanks to https://github.com/CarnVanBeck
 - fixed issues when displaying static data from compendie
 - added option to show item image instead of d20 symbol. no functionality changes

## v0.8.3
 - minor module.json change

## v0.8.2
 - fixed compability with dnd5e v0.94

## v0.8.1
 - fixed a bug when attempting to drag a new item onto the sheet

## v0.8.0 - the bugfix galore edition
 - new Feature: you can now drag and drop items between the different categorys to quickly change where they are displayed.
    - the extra little button is still available to do that the old fashioned way
 - new Feature: added a default spell dc display to the spellbook
 - fixed an issue in the selector apps for languages and damagetype immunities, vulnerabilities etc.
 - fixed an issue that newly created items had the wrong item type
 - fixed the width of the health input box
 - fixed the drag and drop default behavior to once again let the user drag out items, either onto the macrobar or into the item directory
 - fixed a bug in overwriting the default maximum spellslots with a custom value

## v0.7.9
 - fixed a bug that displayed the wrong value for skills

## v0.7.8
 - fixed a bug that prevented the module from working in dnd5e 0.90

## v0.7.7
 - fixed some minor bugs

## v0.7.5
 - fixed a bug that caused unnessesary rerenders when toggling item descriptions
 - imrpoved fonzsize

## v0.7.6
 - changed korean translation from kr to ko

## v0.7.3
 - fixed max spell slots to be overwritable

## v0.7.2
  - Changed the auto resizing when opening the sheet
    - it will now only resize on the initial opening of the sheet
    - the sheet will now remember the width and height upon closing and restore them upon reopening
  - rewrote and fixed some css issues
  - added caster level support

## v0.7.1
 - fixed for Foundry VTT 0.5.5
 - added direct support for item/feature charges within the actor sheet

