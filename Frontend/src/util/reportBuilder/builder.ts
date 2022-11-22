import {actionsTypeFormatter, personnelTypeFormatter, roleFormatter, storyTypeFormatter} from "../formatterUtil";
import {Story, ToBeInspectedReference} from "../../types/area.types";
import {Damage} from "../../types/inspection.types";
import {SpoilageAgent} from "../../types/spoilageAgent.types";

function getRoles(responsible: any){
    let roles = ''
    responsible.role.forEach((v: any, i: any) => {
        const formattedV : string = roleFormatter(v);
        if(i === 0){
            roles = formattedV;
        }else{
            roles = roles + ", " + formattedV;
        }
    })
    return roles;
}

function mapElements(elements: any[], name: any) : any[]{
    if (elements.length !== 0){
        return elements.map((e:any) => {
                return {
                    table: {
                        widths: ['*'],
                        layout: {
                            noBorders: true,
                        },
                        body: [
                            [
                                {
                                    text: e.name,
                                    style: 'elementName',
                                }
                            ],
                            [
                                {
                                    text: `Elemento no. ${e.id}`,
                                    style: 'elementID',
                                },
                            ],
                            [
                                {
                                    columns: [
                                        {
                                            text: 'Localización: ',
                                            style: 'childTitle',
                                            width: '30%',

                                        },
                                        {
                                            text: 'Ubicación exacta: ',
                                            style: 'childTitle',
                                            width: '70%',
                                        },
                                    ]

                                },
                            ],
                            [
                                {
                                    columns: [
                                        {
                                            text: name,
                                            width: '30%',
                                            style: 'elementContent',
                                        },
                                        {
                                            text: e.location,
                                            width: '70%',
                                            style: 'elementContent',
                                        },
                                    ]

                                },
                            ],
                            [
                                {
                                    text: 'Descripción: ',
                                    style: 'childTitle',
                                },
                            ],
                            [
                                {
                                    text: e.description,
                                    style: 'elementContent',
                                },
                            ]
                        ],
                    },
                    layout: 'noBorders',
                    fillColor: '#F1F1F1',
                    margin: [0, 0, 0, 10]
                }
            })
    }else{
        return [
            {
                table: {
                    widths: ['*'],
                    layout: {
                        noBorders: true,
                    },
                    body: [
                        [
                            {
                                text: "Este área no posee elementos asociados.",
                                style: "elementName",
                            }
                        ]
                    ]
                },
                layout: 'noBorders',
                fillColor: '#F1F1F1',
                margin: [0, 0, 0, 10]
            }

        ]
    }
}

function mapDamages(damages: Damage[], spoilageAgents: Array<SpoilageAgent>): any []{
    return damages.map((damage: Damage) =>{
        let baseMapping = {
            table: {
                widths: ['*'],
                body: [
                    [

                        {
                            text: "Agente de deterioro identificado" ,
                            style: 'elementName'

                        }
                    ],
                    [
                        {
                            text: spoilageAgents.find((spoilageAgent: SpoilageAgent) => {
                                return spoilageAgent.id == damage.spoilageAgentId;
                            })?.name,
                            style: 'elementContent',
                        }
                    ],
                    [
                        {
                            text: "Observaciones",
                            style: 'elementTitle',
                        }

                    ],
                    [
                        {
                            text: damage.observations,
                            style: 'elementContent',
                        }
                    ],
                    [
                        {
                            text: "Recomendaciones de tratamiento",
                            style: 'elementTitle',
                        }

                    ],
                    [
                        {
                            text: damage.recommendations,
                            style: 'elementContent',
                        }
                    ]
                ]
            },
            layout: 'noBorders',
            margin: [0, 5, 0, 5],
            fillColor: '#F1F1F1'
        }

        if(damage.image.length != 0){
            baseMapping.table.body.push([
                {
                    text: "Imagen asociada",
                    style: 'elementTitle',
                }
            ])
            baseMapping.table.body.push([
                {
                    // @ts-ignore
                    text: damage.image[0].name,
                    // @ts-ignore
                    link: damage.image[0].source,
                    style: 'link',
                }

            ])
        }

        return baseMapping;
    })
}

function getElementDescription(toBeInspected: ToBeInspectedReference| null){
    if(toBeInspected){
        let res = {
            style: 'theatreID',
            text: ""
        }
        if(toBeInspected.type == 'AREA'){
            res.text = "Área: " + toBeInspected.name;
        }else{
            res.text = "Elemento: " + toBeInspected.name;
        }
        return res;
    }else{
        return {
            style: 'theatreID',
            text: "Estructural"
        }
    }
}

interface Builder {
    makeHeader(): void;
    makeContent(): void;
    makeSettings(): void;
    getReport(): Report;
}

class Report{
    private _header: any;
    private _content: any[];
    private _settings: any;


    get header(): any {
        return this._header;
    }

    set header(value: any) {
        this._header = value;
    }

    get content(): any[] {
        return this._content;
    }

    set content(value: any[]) {
        this._content = value;
    }

    get settings(): any {
        return this._settings;
    }

    set settings(value: any) {
        this._settings = value;
    }


    constructor() {
        this._settings = [];
        this._header = [];
        this._content = [];
    }

    public getDocument(): any {
        return {
            header: this._header,
            content: this._content,
            ...this._settings
        }
    }
}

class AreasReportBuilder implements Builder {
    private _report: Report
    private _data: any

    constructor(data: any) {
        this._report = new Report()
        this._data = data;
    }

    public reset(): void {
        this._report = new Report()
        this._data = {}
    }


    get report(): Report {
        return this._report;
    }

    set report(value: Report) {
        this._report = value;
    }

    get data(): any {
        return this._data;
    }

    set data(value: any) {
        this._data = value;
    }

    public makeHeader(): void {
        this._report.header = {
            table: {
                widths: ['60%', '40%'],
                heights: [40, 20],
                body: [
                    [
                        {
                            text: 'REPORTE DE ÁREAS Y ELEMENTOS',
                            style: 'header',
                        },

                        [

                            {
                                table: {
                                    widths: ['*'],
                                    body: [
                                        [
                                            {
                                                text: 'Foyer: Conservación patrimonial',
                                                style: 'info'
                                            }
                                        ],
                                        [
                                            {
                                                text: 'Teatro Nacional de Costa Rica',
                                                style: 'info'
                                            }
                                        ],
                                        [
                                            {
                                                text: 'Avenida 2, C. 5, Catedral, San José, Costa Rica',
                                                style: 'info'
                                            }
                                        ],
                                        [
                                            {
                                                text: new Date().toLocaleString('es-ES', {year: 'numeric', month: 'long', day: 'numeric' }) ,
                                                style: 'info'
                                            }
                                        ],
                                    ]
                                },
                                margin: [0, 10, 20, 0],
                                layout: 'noBorders',
                            }
                        ],
                    ],
                ],
            },
            layout: 'noBorders',
        }
    }

    public makeContent(): void {
        this._report.content = this._data.map((v:any) => {
            return [
                {
                    text: v.name,
                    style: 'areaName',
                },
                {
                    text: `Área no. ${v.id}`,
                    style: 'theatreID',
                },
                {
                    columns: [
                        {
                            text: 'Localización: ',
                            style: 'title',
                            width: '30%',
                        },
                        {
                            text: 'Ubicación exacta: ',
                            style: 'title',
                            width: '70%',
                        },
                    ]

                },
                {
                    columns: [
                        {
                            text: storyTypeFormatter(v.story as Story),
                            width: '30%',
                            style: 'content',
                        },
                        {
                            text: v.location,
                            width: '70%',
                            style: 'content',
                        },
                    ]

                },
                {
                    text: 'Descripción: ',
                    style: 'title',
                },
                {
                    text: v.description,
                    style: 'content',
                },
                {
                    text: 'Elementos del área',
                    style: 'elementTitle'
                },
                ...mapElements(v.elementListing, v.name)
            ]
        });
    }

    public makeSettings() : void {
        this._report.settings = {
            pageMargins:  [32, 125, 30, 30],
            styles:{
                header: {
                    bold: true,
                    alignment: 'left',
                    margin: [32, 26, 0, 0],
                    fontSize: 22,
                },
                info: {
                    alignment: 'right',
                    margin: [0, 0, 0, 0],
                    fontSize: 8,
                },
                areaName: {
                    bold: true,
                    margin: [0, 10, 0, 8],
                    fontSize: 18
                },
                elementName: {
                    bold: true,
                    margin: [10, 5, 10, 8],
                    fontSize: 14
                },
                theatreID: {
                    bold: true,
                    color: '#DAA520',
                    margin: [0, 0, 10, 8],
                },
                elementID: {
                    bold: true,
                    color: '#DAA520',
                    margin: [10, 0, 10, 8],
                },
                title: {
                    bold: true,
                    margin: [0, 0, 0, 8],
                },
                childTitle: {
                    bold: true,
                    margin: [10, 0, 10, 8],
                },
                content: {
                    margin: [0, 0, 0, 8],
                },
                elementContent: {
                    margin: [10, 0, 10, 8],
                },
                elementTitle: {
                    bold: true,
                    margin: [0, 10, 0, 8],
                    fontSize: 16,
                },
                elementTable: {}
            },
            defaultStyle: {
                font: 'Roboto'
            },
            footer: {
                text: '*Las imágenes pueden ser descargadas en el detalle de cada área o elemento en el sitio web.',
                margin: [30, 0, 0, 10],
                fontSize: 10
            },
        }
    }

    public getReport(): Report{
        return this._report
    }
}


class SpoilageAgentReportBuilder implements Builder {
    private _report: Report
    private _data: any

    constructor(data: any) {
        this._report = new Report()
        this._data = data;
    }

    public reset(): void {
        this._report = new Report()
        this._data = {}
    }


    get report(): Report {
        return this._report;
    }

    set report(value: Report) {
        this._report = value;
    }

    get data(): any {
        return this._data;
    }

    set data(value: any) {
        this._data = value;
    }

    public makeHeader() {
        this._report.header = {
            table: {
                widths: ['60%', '40%'],
                heights: [40, 20],
                body: [
                    [
                        {
                            text: 'REPORTE DE AGENTES DE DETERIORO',
                            style: 'header',
                        },

                        [

                            {
                                table: {
                                    widths: ['*'],
                                    body: [
                                        [
                                            {
                                                text: 'Foyer: Conservación patrimonial',
                                                style: 'info'
                                            }
                                        ],
                                        [
                                            {
                                                text: 'Teatro Nacional de Costa Rica',
                                                style: 'info'
                                            }
                                        ],
                                        [
                                            {
                                                text: 'Avenida 2, C. 5, Catedral, San José, Costa Rica',
                                                style: 'info'
                                            }
                                        ],
                                        [
                                            {
                                                text: new Date().toLocaleString('es-ES', {year: 'numeric', month: 'long', day: 'numeric' }),
                                                style: 'info'
                                            }
                                        ],
                                    ]
                                },
                                margin: [0, 10, 20, 0],
                                layout: 'noBorders',
                            }
                        ],
                    ],
                ],
            },
            layout: 'noBorders',
            margin: [0, 30, 0, 0]
        }
    }

    public makeContent() {
        this._report.content = [
            {
                text: "Agentes naturales",
                style: 'title'
            },
            ...this._data.filter((v:any) => v.type === 'NATURAL').map((v: any) =>{
                return {
                    table: {
                        widths: ['*'],
                        body: [
                            [{
                                text: v.name,
                                style: 'inner'
                            }]
                        ]
                    },
                    margin : [0, 3, 0, 3],
                    layout: 'noBorders',
                }
            }),
            {
                text: "Agentes circunstanciales",
                style: 'title'
            },
            ...this._data.filter((v:any) => v.type === 'CIRCUMSTANTIAL').map((v: any) =>{
                return {
                    table: {
                        widths: ['*'],
                        body: [
                            [{
                                text: v.name,
                                style: 'inner'
                            }]
                        ]
                    },
                    margin : [0, 3, 0, 3],
                    layout: 'noBorders',
                }
            }),
        ];
    }

    public makeSettings() {
        this._report.settings = {
            pageMargins: [32, 125, 30, 30],
            styles: {
                header: {
                    bold: true,
                    alignment: 'left',
                    margin: [32, 15, 0, 0],
                    fontSize: 22,
                },
                info: {
                    alignment: 'right',
                    margin: [0, 0, 0, 0],
                    fontSize: 8,
                },
                title: {
                    bold: true,
                    fontSize: 18,
                    margin: [0, 10, 0,10]
                },
                inner: {
                    margin: [10, 5, 0, 5],
                    fillColor: '#F1F1F1',
                    fontSize: 10,
                }
            }
        }
    }

    public getReport(): Report{
        return this._report
    }
}

class ResponsibleReportBuilder implements Builder {
    private _report: Report
    private _data: any

    constructor(data: any) {
        this._report = new Report()
        this._data = data;
    }

    public reset(): void {
        this._report = new Report()
        this._data = {}
    }


    get report(): Report {
        return this._report;
    }

    set report(value: Report) {
        this._report = value;
    }

    get data(): any {
        return this._data;
    }

    set data(value: any) {
        this._data = value;
    }

    public makeHeader() {
        this._report.header = {
            table: {
                widths: ['60%', '40%'],
                heights: [40, 20],
                body: [
                    [
                        {
                            text: 'REPORTE DE ENCARGADOS',
                            style: 'header',
                        },

                        [

                            {
                                table: {
                                    widths: ['*'],
                                    body: [
                                        [
                                            {
                                                text: 'Foyer: Conservación patrimonial',
                                                style: 'info'
                                            }
                                        ],
                                        [
                                            {
                                                text: 'Teatro Nacional de Costa Rica',
                                                style: 'info'
                                            }
                                        ],
                                        [
                                            {
                                                text: 'Avenida 2, C. 5, Catedral, San José, Costa Rica',
                                                style: 'info'
                                            }
                                        ],
                                        [
                                            {
                                                text: new Date().toLocaleString('es-ES', {year: 'numeric', month: 'long', day: 'numeric' }),
                                                style: 'info'
                                            }
                                        ],
                                    ]
                                },
                                margin: [0, 10, 20, 0],
                                layout: 'noBorders',
                            }
                        ],
                    ],
                ],
            },
            layout: 'noBorders',
            margin: [0, 30, 0, 0]
        }
    }

    public makeContent() {
        this._report.content = [
            {
                text: "Encargados",
                style: 'title',
            },
            this._data.responsible.map((v:any) => {
                return {
                    table: {
                        widths: ['*'],
                        body: [
                            [
                                {
                                    columns: [
                                        {
                                            text: v.user.name + " " + v.user.surname,
                                            style: 'responsibleName'

                                        },
                                        {
                                            text: personnelTypeFormatter(v.type),
                                            style: 'type',
                                        }
                                    ],
                                    style: 'inner',
                                }
                            ],
                            [
                                {
                                    text: 'Identificación: ' + v.user.id,
                                    style: 'inner',
                                }
                            ],
                            [
                                {
                                    text: 'Roles: ' + getRoles(v),
                                    style: 'inner',
                                }
                            ],
                            [
                                {
                                    text: 'Correo: ' + v.user.email,
                                    style: 'inner',
                                }
                            ],
                            [
                                {
                                    text: 'Empresa: ' + v.companyName,
                                    style: 'inner',
                                }
                            ]
                        ]
                    },
                    layout: 'noBorders',
                    margin: [0, 5, 0, 5]
                }
            }),
            {
                text: "Empresas",
                style: 'title',
            },
            this._data.companies.map((v: any) => {
                return {
                    table: {
                        widths: ['*'],
                        body: [
                            [
                                {

                                    text: v.name,
                                    style: 'companyName'
                                }
                            ],
                            [
                                {
                                    text: 'Identificación: ' + v.id,
                                    style: 'innerCompanyTitle',
                                }
                            ],
                            [
                                {
                                    text: 'Correo: ' + v.email,
                                    style: 'inner',
                                }
                            ]
                        ]
                    },
                    layout: 'noBorders',
                    margin: [0, 5, 0, 5]
                }
            }),

        ]
    }

    public makeSettings() {
        return this._report.settings =  {
            pageMargins: [32, 125, 30, 30],
            styles: {
                header: {
                    bold: true,
                    alignment: 'left',
                    margin: [32, 26, 0, 0],
                    fontSize: 22,
                },
                info: {
                    alignment: 'right',
                    margin: [0, 0, 0, 0],
                    fontSize: 8,
                },
                title: {
                    bold: true,
                    fontSize: 18,
                    margin: [0, 15, 0, 15]
                },
                inner: {
                    margin: [10, 5, 0, 5],
                    fillColor: '#F1F1F1',
                    fontSize: 10,
                },
                responsibleName: {
                    bold: true,
                    fontSize: 12,
                },
                type: {
                    bold: true,
                    color: '#DAA520',
                    margin: [0, 4, 0, 0],
                },
                companyName: {
                    bold: true,
                    fontSize: 12,
                    margin: [10, 5, 0, 5],
                    fillColor: '#F1F1F1'
                },
                innerCompanyTitle: {
                    margin: [10, 5, 0, 5],
                    fontSize: 10,
                    fillColor: '#F1F1F1',
                }
            }
        }
    }

    public getReport(): Report{
        return this._report
    }
}
class OperativeCloseInspectionReport implements Builder {
    private _report: Report
    private _data: any

    constructor(data: any) {
        this._report = new Report()
        this._data = data;
    }

    public reset(): void {
        this._report = new Report()
        this._data = {}
    }


    get report(): Report {
        return this._report;
    }

    set report(value: Report) {
        this._report = value;
    }

    get data(): any {
        return this._data;
    }

    set data(value: any) {
        this._data = value;
    }

    public makeHeader() {
        this._report.header = {
            table: {
                widths: ['60%', '40%'],
                heights: [40, 20],
                body: [
                    [
                        {
                            text: 'RESULTADOS DE INSPECCIÓN',
                            style: 'header',
                        },

                        [

                            {
                                table: {
                                    widths: ['*'],
                                    body: [
                                        [
                                            {
                                                text: 'Foyer: Conservación patrimonial',
                                                style: 'info'
                                            }
                                        ],
                                        [
                                            {
                                                text: 'Teatro Nacional de Costa Rica',
                                                style: 'info'
                                            }
                                        ],
                                        [
                                            {
                                                text: 'Avenida 2, C. 5, Catedral, San José, Costa Rica',
                                                style: 'info'
                                            }
                                        ],
                                        [
                                            {
                                                text: new Date().toLocaleString('es-ES', {year: 'numeric', month: 'long', day: 'numeric' }),
                                                style: 'info'
                                            }
                                        ],
                                    ]
                                },
                                margin: [0, 10, 20, 0],
                                layout: 'noBorders',
                            }
                        ],
                    ],
                ],
            },
            layout: 'noBorders',
            margin: [0, 30, 0, 0]
        }
    }

    public makeContent() {
        this._report.content = [
            {
                text: "Inspección No. " + this._data.data.id,
                style: 'areaName',
            },
            getElementDescription(this._data.toBeInspected),
            {
                text: "Acción resultante: " + actionsTypeFormatter(this._data.data.suggestedAction),
                style: 'childTitle',
            },
            {
                text: "Registro de daños",
                style: 'areaName',
            },
            ...mapDamages(this._data.data.damageListing, this._data.spoilageAgents),
        ]
    }

    public makeSettings() {
        return this._report.settings = {
            pageMargins: [32, 120, 30, 30],
            styles: {
                header: {
                    bold: true,
                    alignment: 'left',
                    margin: [32, 26, 0, 0],
                    fontSize: 22,
                },
                info: {
                    alignment: 'right',
                    margin: [0, 0, 0, 0],
                    fontSize: 8,
                },
                areaName: {
                    bold: true,
                    margin: [0, 10, 0, 8],
                    fontSize: 18
                },
                elementName: {
                    bold: true,
                    margin: [10, 10, 0, 8],
                    fontSize: 16,
                },
                theatreID: {
                    bold: true,
                    color: '#DAA520',
                    margin: [0, 0, 10, 8],
                },
                elementID: {
                    bold: true,
                    color: '#DAA520',
                    margin: [10, 0, 10, 8],
                },
                title: {
                    bold: true,
                    margin: [0, 0, 0, 8],
                },
                childTitle: {
                    bold: true,
                    margin: [0, 0, 10, 8],
                },
                content: {
                    margin: [0, 0, 0, 8],
                },
                elementContent: {
                    margin: [10, 0, 10, 8],
                },
                elementTitle: {
                    bold: true,
                    margin: [10, 0, 0, 8],
                    fontSize: 16,
                },
                link: {
                    bold: true,
                    margin: [10, 0, 10, 8],
                    color: "#3333FF",
                    decoration: 'underline'
                },
                elementTable: {}
            },
            defaultStyle: {
                font: 'Roboto'
            }
        }
    }

    public getReport(): Report{
        return this._report
    }
}

class Director {
    private _builder: Builder;

    get builder(): Builder {
        return this._builder;
    }

    set builder(value: Builder) {
        this._builder = value;
    }

    constructor(builder: Builder) {
        this._builder = builder;
    }

    public buildReport() {
        this._builder.makeHeader();
        this._builder.makeContent();
        this._builder.makeSettings()
    }
}

export {
    Director,
    AreasReportBuilder,
    ResponsibleReportBuilder,
    SpoilageAgentReportBuilder,
    Report,
    OperativeCloseInspectionReport
};

export type { Builder };
