import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'millisecondsToMinutes'
})
export class MillisecondsToMinutesPipe implements PipeTransform {

  transform(value: string | null | undefined): string {
   

    if (!value) return 'N/A';

  
    const secondsPart = value.split('.')[0];
    const totalSeconds = Number(secondsPart);

    if (isNaN(totalSeconds)) return 'N/A';

    const minutes = Math.floor(totalSeconds / 60);
    return `${minutes} min`;
  }

}
