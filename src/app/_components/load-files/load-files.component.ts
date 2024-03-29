import { Component, Inject, OnInit, ViewChild } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DTOParameter } from '../../_model/DTOParameter';
import { DTOWfDocs } from '../../_model/DTOWfDocs';
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

  maxFiles: number;
  sizeFiles: number;
  sizeFilesName: number;
  acceptFiles: string;
  documentos: DTOWfDocs[] = [];
  docs: DTOWfStepParameterDoc[] = [];
  indObligatorio: boolean;
  documentosObligatorios: String[] = [];

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
        let name = doc.nomDocumento.replaceAll(" ", "_")

        if (selectedFile.size > this.sizeFiles) {
          this.showMessage("El tamaño máximo por archivo permitido es " + this.sizeFiles);
          this.init();
          break;
        }
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = () => {
          const d = new DTOWfDocs();
          d.idDocumento = doc.idDocumento
          d.value = reader.result + ""
          d.nomDocumento = name
          this.documentos.push(d);
        };

      }
    }
  }

  removeSelectedFile(index) {
    this.documentos.splice(index, 1);
  }

  send() {

    if (this.documentos.length > 0) {
      this.documentosObligatorios = [];
      this.docs.forEach(o => {
        this.indObligatorio = true;
        if (o.indObligatorio == "S") {
          this.indObligatorio = false;
          this.documentos.forEach(f => {
            if (f.idDocumento == o.idDocumento) {
              this.indObligatorio = true;
            }
          });
        }
        if (!this.indObligatorio && !this.step.isUpdate) {
          this.documentosObligatorios.push(o.nomDocumento)
        }
      });
      if (this.documentosObligatorios.length > 0) {
        this.showMessage("Debe ingresar los documentos que son Obligatorios." + this.documentosObligatorios);
        return
      }

      if (this.step.files != null) {
        this.step.files = this.step.files.concat(this.documentos);
      } else {
        this.step.files = this.documentos;
      }

      this.wfService.wf_step_event_docs.next(this.step);
      this.init();
      this.dialogRef.close();

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
    if (undefined == this.step.filesParam || this.step.filesParam.length == 0) {
      this.wfParamService.listStepDocsByIds(Number(this.step.idWf), Number(this.step.nextStep)).subscribe(async (res: DTOWfStepParameterDoc[]) => {
        this.docs = res;
      }, error => {
        console.log(error);
        this.loading = false;
      });
    } else {
      this.docs = this.step.filesParam;
    }
  }

  showMessage(message: string) {
    this.loading = false;
    this.dialog.open(DialogMessageComponent, {
      width: '300px',
      data: message,
    });
  }

  init() {
    this.documentos = [];
  }

}
