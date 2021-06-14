import { BehaviorSubject, of, throwError, MonoTypeOperatorFunction, pipe } from 'rxjs'
import { map, concatMap, catchError, mapTo, tap } from 'rxjs/operators'

class Irp {
  private errorMessage = ''
  public setError(e: string) {
    console.log('setError', e)
    this.errorMessage = e
  }
}

const irp = new Irp()
enum S {
  STATE_1 = 'STATE_1',
  STATE_2 = 'STATE_2',
  STATE_3 = 'STATE_3'
}

var state: S = S.STATE_1
const state$ = new BehaviorSubject<S>(state)
state$.subscribe(s => {
  state = s
})

function allowedStates<Irp>(currentState: S, allowedStates: S[]): MonoTypeOperatorFunction<Irp> {
  return pipe(
    concatMap((irp: Irp) =>
      allowedStates.indexOf(currentState) !== -1 ? of(irp) : throwError(new Error(`invalid action for state`))
    )
  )
}

const source = of(irp).pipe(
  allowedStates(state, [S.STATE_1]),
  mapTo(S.STATE_2),
  catchError(e => {
    console.log('catchError', e.message)
    irp.setError(e.message)
    return of(state)
  })
)

source.subscribe(console.log)
console.log(irp)
