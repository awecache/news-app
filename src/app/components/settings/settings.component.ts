import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppDatabaseService } from 'src/app/app-database.service';
import { ApiKey } from 'src/app/model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup = this.fb.group({
    apiKey: ['', [Validators.required]],
  });
  apiKey?: ApiKey;

  constructor(
    private fb: FormBuilder,
    private appDB: AppDatabaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.appDB.getKey().then((key) => {
      console.log(key);
      this.apiKey = key[0];
    });
  }

  goBack() {
    console.log('back');
    this.settingsForm.setValue({ apiKey: '' });
    this.router.navigate(['/countries']);
  }

  onDelete() {
    this.appDB.deleteKey();
  }

  onAdd() {
    const key = this.settingsForm.get('apiKey')?.value;
    if (key) {
      this.appDB.addKey({ key });
      this.settingsForm.setValue({ apiKey: '' });
    }
  }
}
