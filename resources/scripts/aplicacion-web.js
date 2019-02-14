import {MDCRipple} from '@material/ripple';
import {MDCTopAppBar} from '@material/top-app-bar/index';
import {MDCChipSet} from '@material/chips';
import {MDCSelect} from '@material/select';
import {MDCTextField} from '@material/textfield';
import {MDCTab} from '@material/tab';
import {MDCFormField} from '@material/form-field';
import {MDCRadio} from '@material/radio';
import {MDCList} from '@material/list';

//Instancias comunes
const topAppBarElement = document.querySelector('.mdc-top-app-bar');
const topAppBar = new MDCTopAppBar(topAppBarElement);
const selector = '.mdc-button, .mdc-card__primary-action';
const ripples = [].map.call(document.querySelectorAll(selector), function(el) {  
    return new MDCRipple(el);
});

//Instancias de páginas especificas
if(document.querySelector('.mdc-chip-set')){
    const chipSetEl = document.querySelector('.mdc-chip-set');
    const chipSet = new MDCChipSet(chipSetEl);
}

if(document.querySelector('.mdc-select')){
    const select = new MDCSelect(document.querySelector('.mdc-select'));
}

if (document.querySelector('.mdc-text-field')){
    const textFields = [].map.call(document.querySelectorAll('.mdc-text-field'), function(el) {
        return new MDCTextField(el);
    });
}

if (document.querySelector('.mdc-tab')){
    const tabs = [].map.call(document.querySelectorAll('.mdc-tab'), function(el) {
        return new MDCTab(el);
    });
}

if (document.querySelector('.mdc-radio')){
    const radio = new MDCRadio(document.querySelector('.mdc-radio'));
    const formField = new MDCFormField(document.querySelector('.mdc-form-field'));
    formField.input = radio;
}

if (document.querySelector('.mdc-list')){
    const list = new MDCList(document.querySelector('.mdc-list'));
    const listItemRipples = list.listElements.map((listItemEl) => new MDCRipple(listItemEl));
}

if (document.querySelector('.mdc-icon-button')){
    const iconButtonRipple = new MDCRipple(document.querySelector('.mdc-icon-button'));
    iconButtonRipple.unbounded = true;
}

