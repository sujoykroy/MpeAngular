import { TestBed, inject } from '@angular/core/testing';

import { SceneService } from './scene.service';
import { MpFileService } from './mpfile.service';
import { HttpClientModule } from '@angular/common/http';

describe('SceneService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule,],
            providers: [SceneService, MpFileService]
        });
    });

    it('should be created', inject([SceneService], (service: SceneService) => {
        expect(service).toBeTruthy();
    }));
});
