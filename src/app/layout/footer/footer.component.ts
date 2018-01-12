import { Component, OnInit } from '@angular/core';
import { SceneService } from '../../misc/scene.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(public sceneService: SceneService) { }

  ngOnInit() {
  }

}
