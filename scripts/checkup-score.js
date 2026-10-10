/* Show Checkup scoring engine, shared by checkup.html and report.html */
window.CheckupScore = (function(){
  var STAGES = [
    {key:'prescribe', label:'Prescribe', qs:[0]},
    {key:'prepare',   label:'Prepare',   qs:[1,2]},
    {key:'perform',   label:'Perform',   qs:[3]},
    {key:'prove',     label:'Prove',     qs:[4,5]}
  ];
  var ADVICE = {
    prescribe:"Set the split before you book a single meeting. Decide what share of the calendar belongs to new business, and measure it.",
    prepare:"Book target accounts before doors open, and put your technical people where new business will walk up.",
    perform:"Ask every visitor the same few questions and give each lead a priority on the spot.",
    prove:"Give every priority lead a named owner within 48 hours, and report pipeline by show at 30, 60 and 90 days."
  };

  function bandFor(total){
    if(total < 40) return 'Leaking';
    if(total < 70) return 'Patchy';
    return 'Performing';
  }

  function compute(answers){
    var sum = answers.reduce(function(a,b){ return a + b }, 0);
    var total = Math.round(sum / 18 * 100);
    var band = bandFor(total);
    var stagePct = {}, weakest = null, weakestPct = 101;
    STAGES.forEach(function(s){
      var pts = s.qs.reduce(function(a,i){ return a + answers[i] }, 0);
      var pct = Math.round(pts / (s.qs.length * 3) * 100);
      stagePct[s.key] = pct;
      if(pct < weakestPct){ weakestPct = pct; weakest = s.key }
    });
    return { total: total, band: band, stagePct: stagePct, weakest: weakest, advice: ADVICE[weakest] };
  }

  function encode(answers){ return answers.join(''); }

  function decode(str){
    if(!str || !/^[0-3]{6}$/.test(str)) return null;
    return str.split('').map(Number);
  }

  return { STAGES: STAGES, ADVICE: ADVICE, compute: compute, encode: encode, decode: decode };
})();
