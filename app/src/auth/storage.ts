export function saveMapOAuthToUserFct(fct: CallableFunction) {
  let fctString =
    fct instanceof Function
      ? fct.toString()
      : Function.prototype.toString.call(fct);
  localStorage.setItem('mapOAuthToUser', fctString);
}

export function pullMapOAuthToUserFct(): CallableFunction | null {
  const fctString = localStorage.getItem('mapOAuthToUser');
  localStorage.removeItem('mapOAuthToUser');
  const fct = new Function(`return ${fctString}`)();
  return fct;
}

export function hasMapOAuthToUserFct(): boolean {
  return !!localStorage.getItem('mapOAuthToUser');
}
