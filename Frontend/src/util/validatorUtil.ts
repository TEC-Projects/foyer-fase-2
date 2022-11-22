import {User, Credentials} from "../types/user.types";
import validator from "validator";
import isNumeric = validator.isNumeric;
import isEmail = validator.isEmail;
import isEmpty = validator.isEmpty;
import {AddResponsible, Company, Role} from "../types/responsible.types";
import {PasswordRecovery} from "../types/context.types";
import {
    AdminCloseInspection,
    Damage,
    InspectionFilters,
    OperativeCloseInspection,
    PlanModifyInspection
} from "../types/inspection.types";
import {AddModifyArea, AddModifyElement} from "../types/area.types";
import {CreateSpoilageAgent, UpdateSpoilageAgent} from "../types/spoilageAgent.types";


/**
 * Validator function that checks sign in data integrity.
 */
const validateSignIn = (data:Credentials) : void | Error => {
    if(isEmpty(data.username)){
        throw new Error("Por favor ingrese su nombre de usuario")
    }
    if(isEmpty(data.password)){
        throw new Error("Por favor ingrese su contraseña")
    }
}

/**
 * Validator function that checks the adding new user process data integrity.
 */
const validateAddUser = (data:User) : void | Error => {
    validateResponsibleId(data.id);
    if(data.name.length === 0){
        throw new Error("Por favor ingrese el nombre del usuario")
    }
    if(data.surname.length === 0){
        throw new Error("Por favor ingrese el apellido del usuario")
    }
    if(!isEmail(data.email)){
        throw new Error("Por favor ingrese el correo electrónico del usuario")
    }
}

/**
 * Validator function that checks the data integrity of the first step of the forgot password process.
 */
const validateForgotPasswordFirstStep = (email:string) : void | Error => {
    if(!isEmail(email)){
        throw new Error("Por favor ingrese un correo electrónico válido")
    }
}


/**
 * Validator function that checks the data integrity of the second step of the forgot password process.
 */
const validateForgotPasswordSecondStep = (data:PasswordRecovery) : void | Error => {
    validatePasswordAndConfirmation(data.password, data.passwordConfirmation);
    if(!isNumeric(data.code)){
        throw new Error("Por favor ingrese un código de recuperación numérico.")
    }
    if(data.code.length < 6){
        throw new Error("Por favor ingrese un código de recuperación de al menos 6 dígitos.")
    }
};


/**
 * Validator function that checks password and password confirmation gathering process data integrity.
 */
const validatePasswordAndConfirmation = (password:string, passwordConfirmation:string) : void | Error => {
    if(isEmpty(password)){
        throw new Error("Por favor ingrese su contraseña")
    }
    if(isEmpty(passwordConfirmation)){
        throw new Error("Por favor ingrese la confirmación de su contraseña")
    }
    if(password.length < 8){
        throw new Error("Por favor ingrese una contraseña con una extensión mínima de 8 caracteres")
    }
    if(password !== passwordConfirmation){
        throw new Error("Las contraseñas ingresadas no coinciden")
    }
}

/**
 * Validator function that checks inspection filter data integrity.
 */
const validateInspectionFilters = (data:InspectionFilters) : void | Error => {
    if(data.inspectionId){
        if(!isNumeric(data.inspectionId)){
            throw new Error("Por favor ingrese un código de inspección numérico")
        }
    }
    data.responsibleId && validateResponsibleId(data.responsibleId);
}

/**
 * Validator function that checks inspection planning data integrity.
 */
const validatePlanInspection = (data:PlanModifyInspection) : void | Error => {
    if(isEmpty(data.areaId as string)){
        throw new Error("Por favor ingrese un área por inspeccionar")
    }
    if(isEmpty(data.elementId as string)){
        throw new Error("Por favor ingrese un elemento por inspeccionar")
    }
    if(!data.startDate){
        throw new Error("Por favor ingrese una fecha de inicio")
    }
    if(!data.endDate){
        throw new Error("Por favor ingrese una fecha de fin")
    }
    if((data.startDate as Date) > (data.endDate as Date)){
        throw new Error("La fecha de fin debe ser posterior a la de inicio")
    }
    validateResponsibleId(data.responsibleId);
}

/**
 * Validator function that checks inspection modifying data integrity.
 */
const validateModifyInspection = (data:PlanModifyInspection) : void | Error => {
    if(!data.startDate){
        throw new Error("Por favor ingrese una fecha de inicio")
    }
    if(!data.endDate){
        throw new Error("Por favor ingrese una fecha de fin")
    }
    if((data.startDate as Date) > (data.endDate as Date)){
        throw new Error("La fecha de fin debe ser posterior a la de inicio")
    }
    validateResponsibleId(data.responsibleId);
}

/**
 * Validator function that checks area deleting data integrity.
 */
const validateDeleteArea = (areaId:string, deleteConfirmation:string) : void | Error => {
    if(isEmpty(deleteConfirmation)){
        throw new Error("Por favor ingrese el texto de confirmación para eliminar el área")
    }
    if(('Eliminar area: ' + areaId) != deleteConfirmation){
        throw new Error("Por favor ingrese un texto de confirmación válido para eliminar el área")
    }
}


/**
 * Validator function that checks company deleting data integrity.
 */
const validateDeleteCompany = (companyId:string, deleteConfirmation:string) : void | Error => {
    if(isEmpty(deleteConfirmation)){
        throw new Error("Por favor ingrese el texto de confirmación para eliminar la empresa")
    }
    if(('Eliminar empresa: ' + companyId) != deleteConfirmation){
        throw new Error("Por favor ingrese un texto de confirmación válido para eliminar la empresa")
    }
}


/**
 * Validator function that checks company deleting data integrity.
 */
const validateDeleteResponsible = (responsibleId:string, deleteConfirmation:string) : void | Error => {
    if(isEmpty(deleteConfirmation)){
        throw new Error("Por favor ingrese el texto de confirmación para eliminar al encargado")
    }
    if(('Eliminar encargado: ' + responsibleId) != deleteConfirmation){
        throw new Error("Por favor ingrese un texto de confirmación válido para eliminar al encargado")
    }
}


/**
 * Validator function that checks inspection closing by an admin data integrity.
 */
const validateAdminCloseInspection = (inspectionData:AdminCloseInspection) : void | Error => {
    if(isEmpty(inspectionData.suggestedAction)){
        throw new Error('Por favor seleccione una acción resultante');
    }
    validateFileUpload(inspectionData.documentsListing, 'Por favor adjunte un documento de resultados')
}

/**
 * Validator function that checks inspection closing by an operative user data integrity.
 */
const validateOperativeCloseInspection = (inspectionData:OperativeCloseInspection) : void | Error => {
    console.log(inspectionData);
    if(isEmpty(inspectionData.suggestedAction)){
        throw new Error('Por favor seleccione una acción resultante');
    }
    inspectionData.damageListing.forEach((damage : Damage) =>{
        if(isEmpty(damage.spoilageAgentId)){
            throw new Error('Por favor seleccione una un agente de deterioro para el daño registrado');
        }
        if(isEmpty(damage.observations)){
            throw new Error("Por favor ingrese observaciones a todos los reportes de daños")
        }
        if(damage.observations.length > 2500){
            throw new Error("Por favor ingrese por elemento un nombre menor a 25 caracteres")
        }
        if(isEmpty(damage.recommendations)){
            throw new Error("Por favor ingrese recomendaciones a todos los reportes de daños")
        }
        if(damage.recommendations.length > 2500){
            throw new Error("Por favor ingrese por elemento un nombre menor a 25 caracteres")
        }
    })
}

/**
 * Validator function that checks file upload data integrity.
 */
const validateFileUpload = (files : Array<File | null> | undefined, customMessage:string) : void | Error => {
    if(files && files.length === 0){
        throw new Error(customMessage)
    }
}

/**
 * Validator function that checks responsible identification data integrity.
 */
const validateResponsibleId = (responsibleId : string) : void | Error => {
    if(!isNumeric(responsibleId, {no_symbols: true})){
        throw new Error("Por favor ingrese una identificación numérica")
    }
    if(responsibleId.length !== 9){
        throw new Error("Por favor ingrese una identificación de al menos 9 dígitos")
    }
}

/**
 * Validator function that checks add responsible process data integrity.
 */
const validateAddResponsible = (responsibleData : AddResponsible, roles: Array<Role>) : void | Error => {
    validateResponsibleId(responsibleData.userId);
    if(isEmpty(responsibleData.companyId)){
        throw new Error("Por favor seleccione una empresa a la cual asociar el usuario seleccionado")
    }
    if(roles.length === 0){
        throw new Error("Por favor seleccione al menos un rol del encargado a añadir")
    }

}

const validateTransferElement = (currentAreaId:string, destinationAreaId:string) => {
    if(currentAreaId === destinationAreaId){
        throw new Error("Por favor seleccione una área de destino distinta a la actual")
    }
}

/**
 * Validator function that checks area addition or modifying data integrity.
 */
const validateAddModifyArea = (data : AddModifyArea) : void | Error => {
    if(isEmpty(data.name)){
        throw new Error("Por favor ingrese el nombre del área")
    }
    if(data.name.length > 25){
        throw new Error("Por favor ingrese un nombre de area menor a 25 caracteres")
    }
    if(isEmpty(data.description)){
        throw new Error("Por favor ingrese la descripción del área")
    }
    if(data.description.length > 1000){
        throw new Error("Por favor ingrese una descipción del area menor a 150 caracteres")
    }
    if(isEmpty(data.location)){
        throw new Error("Por favor ingrese la ubicación exacta del área")
    }
    if(data.location.length > 300){
        throw new Error("Por favor ingrese una ubicación exacta del area menor a 150 caracteres")
    }
    validateFileUpload(data.imagesListing as Array<File>, 'Por favor adjunte por lo menos una imagen del área')

    data.elementListing.forEach((element : AddModifyElement) =>{
        if(isEmpty(element.name)){
            throw new Error("Por favor ingrese ingrese el nombre de todos los elementos")
        }
        if(data.name.length > 25){
            throw new Error("Por favor ingrese por elemento un nombre menor a 25 caracteres")
        }
        if(isEmpty(element.description)){
            throw new Error("Por favor ingrese la descripción de todos los elemento")
        }
        if(data.description.length > 1000){
            throw new Error("Por favor ingrese por elemento una descripción menor a 150 caracteres")
        }
        if(isEmpty(element.location)){
            throw new Error("Por favor ingrese la ubicación exacta de todos los elemento")
        }
        if(data.location.length > 300){
            throw new Error("Por favor ingrese por elemento una ubicación exacta menor a 150 caracteres")
        }
        validateFileUpload(element.imagesListing as Array<File>, 'Por favor adjunte por lo menos una imagen en cada elemento')
    })
};

/**
 * Validator function that checks add company data integrity.
 */
const validateAddCompany = (data: Company) : void | Error => {
    if(isEmpty(data.name)){
        throw new Error("Por favor ingrese la razón social")
    }
    if(isEmpty(data.id)){
        throw new Error("Por favor ingrese la cédula juridica")
    }
    if(!isNumeric(data.id, {no_symbols: true})){
        throw new Error("La cédula juridica de la empresa debe ser numérica")
    }
    if(data.id.length !== 10){
        throw new Error("La cédula juridica de la empresa debe contener 10 dígitos")
    }
    if(isEmpty(data.email)){
        throw new Error("Por favor ingrese el correo electrónico")
    }
    if(!isEmail(data.email)){
        throw new Error("Por favor ingrese un correo electrónico válido")
    }
};


/**
 * Validator function that checks update company data integrity.
 */
const validateUpdateCompany = (email:string) : void | Error => {
    if(isEmpty(email)){
        throw new Error("Por favor ingrese un correo electrónico")
    }
    if(!isEmail(email)){
        throw new Error("Por favor ingrese un correo electrónico válido")
    }
};


/**
 * Validator function that checks update responsible data integrity.
 */
const validateUpdateResponsible = (roles:Array<Role>) : void | Error => {
    if(roles.length === 0){
        throw new Error("Por favor seleccione al menos un rol del encargado por ")
    }
};



/**
 * Validator function that checks update spoilage agent data integrity.
 */
const validateModifySpoilageAgents = (spoilageAgents : Array<CreateSpoilageAgent | UpdateSpoilageAgent>) : void | Error => {
    spoilageAgents.forEach((agent => {
        if(!agent.name.length){
            throw new Error("Por favor no deje campos vacíos")
        }
    }))
}


export {
    validatePasswordAndConfirmation,
    validateSignIn,
    validateAddUser,
    validateForgotPasswordFirstStep,
    validateForgotPasswordSecondStep,
    validateModifyInspection,
    validatePlanInspection,
    validateAdminCloseInspection,
    validateFileUpload,
    validateAddModifyArea,
    validateResponsibleId,
    validateAddCompany,
    validateInspectionFilters,
    validateModifySpoilageAgents,
    validateAddResponsible,
    validateDeleteArea,
    validateTransferElement,
    validateOperativeCloseInspection,
    validateUpdateCompany,
    validateDeleteCompany,
    validateDeleteResponsible,
    validateUpdateResponsible,
}
