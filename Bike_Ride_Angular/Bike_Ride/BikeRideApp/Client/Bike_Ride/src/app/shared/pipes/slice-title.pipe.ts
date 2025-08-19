import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'sliceTitle',
    standalone: true
})
export class SliceTitlePipe implements PipeTransform {
    transform(value: string, maxLenght: number = 50, buttonHandle:boolean=true): string {
        if (!value) {
            return '';
        }
        const outputValue=value.length > maxLenght && buttonHandle ? value.slice(0, maxLenght) + '...' : value;
        return outputValue;
    }
}
