import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import exercicios from '../data/exercicios.json';

@Component({
  selector: 'app-formulario',
  standalone: true,
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
  imports: [CommonModule, FormsModule]
})
export class FormularioComponent {
  form = {
    nome: '',
    idade: 0,
    objetivo: '',
    frequencia: 3,
    nivel: '',
    lesao: '',
    local: ''
  };

  constructor(private router: Router) {}

  gerarTreino(formRef: NgForm) {
    if (formRef.invalid || this.form.idade < 16 || this.form.idade > 150) {
      return;
    }

    const treinoGerado = this.montarTreino();
    this.router.navigate(['/treino'], {
      queryParams: {
        nome: this.form.nome,
        treino: JSON.stringify(treinoGerado)
      }
    });
  }

  montarTreino() {
    const dias = Number(this.form.frequencia);
    const partes = [
      'Tórax, Ombro ou Tríceps',
      'Costas, Abdômen ou Bíceps',
      'Parte Inferior, Pernas ou Glúteo'
    ];
    const partesSelecionadas: string[] = [];

    let i = 0;
    while (partesSelecionadas.length < dias) {
      const parte = partes[i % partes.length];
      if (this.form.lesao !== 'nenhuma' && parte === this.form.lesao) {
        i++;
        continue;
      }
      if (!partesSelecionadas.includes(parte)) {
        partesSelecionadas.push(parte);
      }
      i++;
    }

    const objetivo = this.form.objetivo.toLowerCase();
    const local = this.form.local.toLowerCase();

    const treinos = partesSelecionadas.map(parte => {
      const lista = (exercicios as any)[parte]?.filter((ex: any) =>
        ex.objetivo.toLowerCase() === objetivo &&
        (local === 'academia' || ex.local.toLowerCase() === local)
      ) || [];

      const selecionados = this.sortearExercicios(lista, 5 + Math.floor(Math.random() * 3));

      return {
        parte,
        exercicios: selecionados
      };
    });

    return treinos;
  }

  sortearExercicios(lista: any[], qtd: number) {
    const copia = [...lista];
    const resultado = [];

    while (resultado.length < qtd && copia.length > 0) {
      const i = Math.floor(Math.random() * copia.length);
      resultado.push(copia[i]);
      copia.splice(i, 1);
    }

    return resultado;
  }
}
