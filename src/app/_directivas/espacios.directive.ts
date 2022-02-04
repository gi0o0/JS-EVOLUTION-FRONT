import { Directive, ElementRef, HostListener } from "@angular/core";
import { EXP_ESPACIOS, EXP_ESPACIOS_TEXTO_INI_FIN } from "../_shared/constantes";

@Directive({
  selector: "[appEspacio]"
})
export class EspaciosDirective {
  inputElement: HTMLElement;
  constructor(public el: ElementRef) {
    this.inputElement = el.nativeElement;
  }

  @HostListener("input", ["$event"]) onInputChange(event) {
    if(this.el.nativeElement.value.replace(EXP_ESPACIOS, '') !== ''){
        this.el.nativeElement.value = this.el.nativeElement.value.replace(EXP_ESPACIOS, ' ');
    } else {
        this.el.nativeElement.value =  this.el.nativeElement.value.replace(EXP_ESPACIOS, '')
    }
  }

  @HostListener("paste", ["$event"])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedInput: string = event.clipboardData
      .getData("text/plain")
      .replace(EXP_ESPACIOS_TEXTO_INI_FIN, '')
      .replace(EXP_ESPACIOS, ' ');
    document.execCommand("insertText", false, pastedInput);
  }

  @HostListener("drop", ["$event"])
  onDrop(event: any) {
    event.preventDefault();
    const textData = event.dataTransfer
      .getData("text")
      .replace(EXP_ESPACIOS_TEXTO_INI_FIN, '')
      .replace(EXP_ESPACIOS, ' ');
    this.inputElement.focus();
    document.execCommand("insertText", false, textData);
  }
}
