<template>
  <article class="max-w-2xl mx-auto px-15">
    <header class="pb-10">
      <h2 class="text-20 md:text-28 font-semibold text-center">Hackathon</h2>
    </header>
    <div class="text-14">
      <p>Dette er en prototype af, hvordan Podcast kunne<br class="md:hidden" /> <em>re-tænkes</em> og implementeres på Aller Media's brand sites og stadig benytte den eksisterende tjeneste, Spreaker.</p>
      <p class="pt-20">Hele "eksperimentet" var en del af 2-dags Hackathon, hvor hovedformålet var at arbejde på tværs af de digitale afdelinger og se hvor hurtigt og effektivt, vi kunne samarbejde om at løse en case.</p>
      <h3 class="text-18 font-medium pt-30">Problemstilling</h3>
      <p class="pt-3">Den nuværende implementering af Podcast er ikke nogen god brugeroplevelse. Fx stopper afspilningen af en podcast, når man låser sin telefon eller navigerer væk fra siden. Desuden åbner Spreaker på en ny fane, hvis slutbrugeren klikker på podcastens titel i afspilleren, og man bliver dermed sendt væk fra den side, hvor afspilleren er indlejret.</p>
      <p class="pt-20">
        <strong class="font-medium">Eksempel på problemstilling:</strong><br/>
        <a href="https://www.femina.dk/agenda/samfund/tidligere-foelte-han-sig-som-en-en-pik-der-skulle-praestere-men-saa-oplevede-han" class="text-pink-400 hover:underline" target="_blank">https://www.femina.dk/agenda/samfund/tidligere-foelte-han-sig-som-en-en-pik-der-skulle-praestere-men-saa-oplevede-han</a>
      </p>
      <p class="pt-20">Herudover har vi set fra et designers og udviklers synspunkt ingen "kontrol" over afspilleren og har derfor ingen mulighed for at <em>customize</em> afspilleren til fx resten af designet med den nuværende implementering</p>
      <h3 class="text-18 font-medium pt-30">Løsningen</h3>
      <p class="pt-3">Roden til den dårlige brugeroplevelse er måden, hvorpå slutbrugeren "modtager" Podcast serierne og de enkelte episoder.</p>
      <p class="pt-20">Når man benytter såkaldte <em>embeds</em>, så er det i virkeligheden et "vindue" ind til et andet website. Det vil sige, når en slutbruger afspiller en episode via <em>embeds</em>, så bliver episoderne i virkeligheden afspillet via Spreaker og ikke vores brand sites. Når slutbrugeren så navigerer væk fra <em>embeddet</em>, så ved browseren ikke, at den skal fortsætte, men lukker simpelthen bare "vinduet" igen.</p>
      <p class="pt-20">Løsniningen til dette er egentlig ganske simpel. Vi skal lave vores egen Podcast-afspiller. Det lyder måske som en stor og kompliceret ting, men faktisk har alle nutidens browsere indbygget såkaldte <em>player capabilities</em>. Ved at benytte disse egenskaber vil en Podcast-episode heller ikke stoppe, når man fx låser sin telefon.</p>
      <p class="pt-20">Ved at lave vores egen Podcast-afspiller får vi fuld kontrol over, hvordan den skal se ud, hvad den skal kunne og ikke kunne, og sidst men ikke mindst kan vi lave den <em>generisk</em>, så den kan bruges som en <em>plug'n'play</em> løsning på alle vores brand sites.</p>
      <p class="pt-20">Men hvordan kan vi afspille Podcast-episoderne, når de alle sammen er <em>uploaded</em> til Spreaker?</p>
      <p class="pt-20">Spreaker tilbyder et såkaldt API. Ved at kommunikere med dette API, giver det os mulighed for at hente data "direkte" fra deres database. I dette data modtager vi blandt andet en <code class="text-13 leading-13 text-pink-600 py-1 px-4 border border-gray-300/70 bg-gray-100 rounded">playback_url</code>. Ved at give vores afspiller denne <code class="text-13 leading-13 text-pink-600 py-1 px-4 border border-gray-300/70 bg-gray-100 rounded">playback_url</code> streamer vi Podcast-episoderne direkte fra Spreaker's servere.</p>
      <h3 class="text-18 font-medium pt-30">Prototype / Demo</h3>
      <p class="pt-3">Dette website er vores endelige prototype og demo af vores 2-dags Hackathon. Vi vil med dette website prøve at demonstrere vores løsningsforeslag ved at have lavet en Podcast-afspiller fra bunden vha. af browserens indbyggede <em>player capabilities</em>.</p>
      <p class="pt-20">Vi vil udover vores egen Podcast-afspiller også illustrere de mange nye døre, der åbner sig ved at benytte Spreaker's API.</p>
      <p class="pt-20">
        Fx har vi lavet følgende eksempler:<br/>
        <ul class="list-disc mt-10 md:ml-30 ml-20">
          <li>En slider med Podcast-serier fra andre brands.</li>
          <li>En oversigt over andre episoder i samme Podcast-serie, samt muligheden for at afspille dem direkte i afspilleren.</li>
          <li><em>Breaker</em> til artikler, med mulighed for at tease for en relateret Podcast-serie.</li>
          <li><em>Breaker</em> til artikler, med mulighed for at tease for en relateret Podcast-episode. Inkl. muligheden for at afspille episoden med det samme direkte fra teaseren.</li>
        </ul>
      </p>
      <h3 class="text-18 font-medium pt-30">Gruppedeltagere</h3>
      <div class="mt-10 border-y-2 divide-y-2">
        <div class="flex flex-col py-10">
          <span class="text-gray-600"><strong class="text-black font-medium">Morten Rugaard</strong> / Tech Lead</span>
          <a href="mailto:morten.rugaard@aller.com?subject=Podcast Hackathon 2023" class="text-pink-400 hover:underline">morten.rugaard@aller.com</a>
        </div>
        <div class="flex flex-col py-10">
          <span class="text-gray-600"><strong class="text-black font-medium">Sofie Grønlund</strong> / Customer- ＆ UX Specialist</span>
          <a href="mailto:sofie.groenlund@aller.com?subject=Podcast Hackathon 2023" class="text-pink-400 hover:underline">sofie.groenlund@aller.com</a>
        </div>
        <div class="flex flex-col py-10">
          <span class="text-gray-600"><strong class="text-black font-medium">Malte Hæstrup</strong> / Analyst Developer</span>
          <a href="mailto:malte.hastrup@aller.com?subject=Podcast Hackathon 2023" class="text-pink-400 hover:underline">malte.hastrup@aller.com</a>
        </div>
        <div class="flex flex-col py-10">
          <span class="text-gray-600"><strong class="text-black font-medium">Jacob Langkjær Nielsen</strong> / Analyst</span>
          <a href="mailto:jacob.nielsen@aller.com?subject=Podcast Hackathon 2023" class="text-pink-400 hover:underline">jacob.nielsen@aller.com</a>
        </div>
        <div class="flex flex-col py-10">
          <span class="text-gray-600"><strong class="text-black font-medium">Tiago Marques</strong> / Front-end Developer</span>
          <a href="mailto:tiago.marques@aller.com?subject=Podcast Hackathon 2023" class="text-pink-400 hover:underline">tiago.marques@aller.com</a>
        </div>
      </div>
    </div>
  </article>
</template>
