import { BaseEntity } from './base.entity';
import { MonetarioVO } from 'src/VOs/MonetarioVO/MonetarioVO';
import { DataHoraVO } from 'src/VOs/DataVO/DataHoraVO';
import { EmailVO } from 'src/VOs/EmailVO/EmailVO';
import { ExemploDto } from 'src/dto/exemplo.dto';

export class EntidadeTeste extends BaseEntity {
  id: number;
  grana: MonetarioVO;
  email: EmailVO;
  dataHora: DataHoraVO;

  //! construtor para quando se tem os objetos já validados
  private constructor(
    id: number,
    grana: MonetarioVO,
    email: EmailVO,
    dataHora: DataHoraVO,
  ) {
    super();
    this.id = id;
    this.grana = grana;
    this.email = email;
    this.dataHora = dataHora;
  }

  //! create pra quando se deseja passar um objeto simples e deixar a entidade cuidar da criação dos VOs
  static create(data: ExemploDto): EntidadeTeste {
    return new EntidadeTeste(data.id!, data.grana, data.email, data.dataHora);
  }

  //! fromJson para desserialização, criando os VOs conforme necessário
  static fromJson(json: Record<string, unknown>): EntidadeTeste {
    // Usa o método da BaseEntity com mapeamentos explícitos
    const instance = super.fromJson(json, {
      grana: MonetarioVO,
      email: EmailVO,
      dataHora: DataHoraVO,
    }) as EntidadeTeste;

    return instance;
  }
}

export class CreateUsuarioDto {
  id?: number;
  grana: number;
  email: string;
  dataHora: string;
}
