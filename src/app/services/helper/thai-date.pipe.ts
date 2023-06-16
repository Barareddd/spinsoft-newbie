import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'thaidate'
})
export class ThaiDatePipe implements PipeTransform {
    transform(date: any, format: string): string {
        let ThaiDay = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์']
        let shortThaiMonth = [
            'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
            'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
        ];
        let longThaiMonth = [
            'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
            'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
        ];

        let inputDate = new Date(date);

        if (typeof date === 'string') {
            inputDate = this.splitDateFomat(date)
        }

        let dataDate = [
            inputDate.getDay(), inputDate.getDate(), inputDate.getMonth(), inputDate.getFullYear(), inputDate.getHours(), inputDate.getMinutes(), inputDate.getSeconds()

        ];

        let outputDateFull = [
            'วัน ' + ThaiDay[dataDate[0]],
            'ที่ ' + dataDate[1],
            'เดือน ' + longThaiMonth[dataDate[2]],
            'พ.ศ. ' + (dataDate[3] + 543)
        ];
        let outputDateShort = [
            dataDate[1],
            shortThaiMonth[dataDate[2]],
            dataDate[3] + 543
        ];
        let outputDateMedium = [
            dataDate[1],
            longThaiMonth[dataDate[2]],
            dataDate[3] + 543
        ];

        let outputShortDate = [
            `${dataDate[1] < 10 ? '0' : ''}${dataDate[1]}`,
            `${dataDate[2] + 1 < 10 ? '0' : ''}${dataDate[2] + 1}`,
            dataDate[3] + 543
        ];

        let outputShortDateTime = [
            `${dataDate[1] < 10 ? '0' : ''}${dataDate[1]}`,
            `${dataDate[2] + 1 < 10 ? '0' : ''}${dataDate[2] + 1}`,
            dataDate[3] + 543,
            `${dataDate[4] < 10 ? '0' : ''}${dataDate[4]}`,
            `${dataDate[5] < 10 ? '0' : ''}${dataDate[5]}`,
            `${dataDate[6] < 10 ? '0' : ''}${dataDate[6]}`,
        ];

        let returnDate: string;
        returnDate = outputDateMedium.join(" ");
        if (format == 'shortDateTime') {
            returnDate = `${outputShortDateTime[0]}/${outputShortDateTime[1]}/${outputShortDateTime[2]} ${outputShortDateTime[3]}:${outputShortDateTime[4]}:${outputShortDateTime[5]}`;
        }

        if (format == 'full') {
            returnDate = outputDateFull.join(" ");
        }
        if (format == 'medium') {
            returnDate = outputDateMedium.join(" ");
        }
        if (format == 'short') {
            returnDate = outputDateShort.join(" ");
        }
        if (format == 'shortDate') {
            returnDate = outputShortDate.join("/");
        }
        return returnDate;
    }

    splitDateFomat(date: any) {
        let dateSplted = date.split('-')
        return new Date(parseInt(dateSplted[0], 10), parseInt(dateSplted[1], 10) - 1, parseInt(dateSplted[2], 10))
    }
}

