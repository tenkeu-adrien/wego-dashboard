import * as Yup from 'yup'

export const schema = Yup.object().shape({
    phone: Yup.string()
        .trim()
        .required('Le numéro de téléphone est obligatoire') ,
    password: Yup.string()
        .trim()
        .required('Le mot de passe est obligatoire')
        .min(6, 'Le mot de passe doit contenir au moins 8 caractères')
       
})
