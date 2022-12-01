import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DTOParameter } from '../../_model/DTOParameter';
import { DTOWfStepParameterDoc } from '../../_model/DTOWfStepParameterDoc';
import { DTOWfSteps } from '../../_model/DTOWfSteps';
import { ParameterService } from '../../_services/parameter/parameter.service';
import { WfService } from '../../_services/wf/wf.service';

import { WfParameterService } from '../../_services/wfparameter/wfparameter.service';
import { DialogMessageComponent } from '../dialog-message/dialog-message.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './load-files.component.html',
  styleUrls: ['./load-files.component.css']
})
export class LoadFilesComponent implements OnInit {

  step: DTOWfSteps;
  errorServicio: boolean;
  loading: boolean = false;

  @ViewChild('attachments') attachment: any;

  listOfFiles: any[] = [];
  maxFilesContador: number = 0;
  maxFiles: number;
  sizeFiles: number;
  sizeFilesName: number;
  acceptFiles: string;
  files: string[] = [];
  docs: DTOWfStepParameterDoc[] = [];

  constructor(private dialogRef: MatDialogRef<LoadFilesComponent>, @Inject(MAT_DIALOG_DATA) public data: DTOWfSteps,
    public dialog: MatDialog, private wfParamService: WfParameterService, private parameterService: ParameterService, private wfService: WfService) {
    this.step = data;
  }

  ngOnInit() {

    this.getParametersFiles();
    this.getDocs();
  }

  onFileChanged(event: any, doc: DTOWfStepParameterDoc) {

    if (event.target.files.length > this.maxFiles) {
      this.showMessage("El máximo de archivos permitidos es " + this.maxFiles);
    } else {
      for (var i = 0; i <= event.target.files.length - 1; i++) {
        var selectedFile = event.target.files[i];
        if (this.listOfFiles.indexOf(selectedFile.name) === -1) {

          var name = selectedFile.name.split('.').slice(0, -1).join('.')

          if (selectedFile.size > this.sizeFiles) {
            this.showMessage("El tamaño máximo por archivo permitido es " + this.sizeFiles);
            this.init();
            break;
          } else if (name.length > this.sizeFilesName) {
            this.showMessage("El tamaño máximo por nombre de archivo permitido es de " + this.sizeFilesName + " caracteres");
            this.init();
            break;
          }
          this.listOfFiles.push(this.step.prefixFile+""+selectedFile.name);
          const reader = new FileReader();
          reader.readAsDataURL(selectedFile);
          reader.onload = () => {
            this.files.push(reader.result + "");
          };
        }
      }
    }
  }

  removeSelectedFile(index) {
    this.listOfFiles.splice(index, 1);
    this.files.splice(index, 1);
  }


  send() {

    if (this.files.length > 0) {
      if (this.files.length < this.maxFilesContador) {
        this.showMessage("Debe ingresar los documentos que son Obligatorios.");
      } else {

        if (this.step.files != null) {
          this.step.files = this.step.files.concat(this.files);
        } else {
          this.step.files = this.files;
        }
        if (this.step.filesNames != null) {
          this.step.filesNames = this.step.filesNames.concat(this.listOfFiles);
        } else {
          this.step.filesNames = this.listOfFiles;
        }
        this.wfService.wf_step_event_docs.next(this.step);
        this.init();
        this.dialogRef.close();
      }
    } else {
      this.showMessage("No se han seleccionado archivos.");
    }
  }

  getParametersFiles() {
    this.parameterService.listParametersByParamId('FILE').subscribe(async (res: DTOParameter[]) => {
      res.forEach(pa => {
        if (pa.text == "SIZE") {
          this.sizeFiles = Number(pa.value)
        } else if (pa.text == "TYPES") {
          this.acceptFiles = pa.value
        } else if (pa.text == "MAX") {
          this.maxFiles = Number(pa.value)
        } else if (pa.text == "SIZE_NAME") {
          this.sizeFilesName = Number(pa.value)
        }
      });
      this.loading = false;
    }, error => {
      console.log(error);
      this.loading = false;
    });
  }

  getDocs() {
    this.wfParamService.listStepDocsByIds(Number(this.step.idWf), Number(this.step.nextStep)).subscribe(async (res: DTOWfStepParameterDoc[]) => {
      res.forEach(o => {

        if (this.step.isRequiredFiles != false) {
          if (o.indObligatorio == "S") {
            this.maxFilesContador += 1;
          }
        }

        this.docs.push(o);
      });
    }, error => {
      console.log(error);
      this.loading = false;
    });
  }


  showMessage(message: string) {
    this.loading = false;
    this.dialog.open(DialogMessageComponent, {
      width: '300px',
      data: message,
    });
  }

  init() {
    this.listOfFiles = [];
    this.files = [];
  }

}
