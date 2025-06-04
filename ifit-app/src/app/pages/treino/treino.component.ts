import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-treino',
  templateUrl: './treino.component.html',
  styleUrls: ['./treino.component.css'],
  standalone: true,
  imports: []
})
export class TreinoComponent {
  nome = '';
  treino: any[] = [];

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.nome = params['nome'] || '';
      this.treino = JSON.parse(params['treino'] || '[]');
    });
  }
}
