// @ts-ignore
import * as pdfMake from "pdfmake/build/pdfmake";
// @ts-ignore
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import {
    AreasReportBuilder,
    Builder,
    Director,
    ResponsibleReportBuilder,
    SpoilageAgentReportBuilder
} from "./reportBuilder/builder";

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

pdfMake.fonts = {
    Roboto: {
        normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
        italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
    },
}


const generateAreasReport = () => {
    let area = {};
    let builder: AreasReportBuilder = new AreasReportBuilder(area)
    let director: Director = new Director(builder)
    director.buildReport()
    let dd = builder.getReport().getDocument()
    pdfMake.createPdf(dd).open();
}

const generateResponsibleReport = (responsibles:any, companies:any) => {
    let builder: ResponsibleReportBuilder = new ResponsibleReportBuilder({responsibles, companies})
    let director: Director = new Director(builder)
    director.buildReport()
    let dd = builder.getReport().getDocument()
    pdfMake.createPdf(dd).open();
}

const generateSpoilageAgentsReport = (data: any) => {
    let builder: SpoilageAgentReportBuilder = new SpoilageAgentReportBuilder(data)
    let director: Director = new Director(builder)
    director.buildReport()
    let dd = builder.getReport().getDocument()
    pdfMake.createPdf(dd).open();
}

const generateReport = (builder: Builder) => {
    let director: Director = new Director(builder)
    director.buildReport()
    let dd = builder.getReport().getDocument()
    pdfMake.createPdf(dd).open();
}

const  getAndOpenReport = (builder: Builder) => {
    let director: Director = new Director(builder)
    director.buildReport()
    let dd = builder.getReport().getDocument()
    let doc = pdfMake.createPdf(dd);
    doc.open();
    return doc;
}


export {
    generateReport,
    getAndOpenReport
}
