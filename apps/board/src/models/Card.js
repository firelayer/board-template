import { db, Firemodel } from '../firebase/index'

/*
|---------------------------------------------------------------------
| Model created by `firelayer make:model Card`
|---------------------------------------------------------------------
*/
export class Card extends Firemodel {
  constructor(id) {
    super(id)
  }

  get collection() {
    return db().collection('cards')
  }
}

export default Card
