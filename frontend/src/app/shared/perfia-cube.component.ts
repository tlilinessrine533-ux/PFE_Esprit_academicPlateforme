import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

type PerfIARole = 'ENSEIGNANT' | 'CHEF_DEPARTEMENT' | 'ADMIN' | 'SUPER_ADMIN' | 'ADMINISTRATION' | string;

const ROLE_LABELS: Record<string, string> = {
  ENSEIGNANT: 'Enseignant',
  CHEF_DEPARTEMENT: 'Chef Dep.',
  ADMIN: 'Admin',
  ADMINISTRATION: 'Admin',
  SUPER_ADMIN: 'Super Admin'
};

@Component({
  selector: 'app-perfia-cube',
  templateUrl: './perfia-cube.component.html',
  styleUrl: './perfia-cube.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PerfIACubeComponent {
  @Input({ required: true }) onClick!: () => void;
  @Input() role: PerfIARole = 'ENSEIGNANT';
  @Input() isOpen = false;
  @Input() label: string | null = null;

  get visualRole() {
    return this.role === 'ADMINISTRATION' ? 'ADMIN' : this.role;
  }

  get title() {
    return `PerfIA - ${ROLE_LABELS[this.visualRole] || this.visualRole}`;
  }

  handleClick() {
    this.onClick?.();
  }
}
