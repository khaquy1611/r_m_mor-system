import * as Yup from 'yup'
import { emailRegex, replaceChars, specialCharacters } from '.'

export const passwordRegex =
  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#&(){}:;,?/*~$^+=<>.-]).{6,32}$/

export const engJapRegex = /^[a-zA-Z0-9ぁ-んァ-ン一-龠０-９ａ-ｚＡ-Ｚ　\s]+$/

const customerPartnerNameRegex =
  /[^一-龠ぁ-ゔァ-ヴーａ-ｚＡ-Ｚ０-９々〆〤ヶa-z0-9A-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ.,/:;+&()‘’'‘’]/u

const projectNameRegex =
  /[^一-龠ぁ-ゔァ-ヴーａ-ｚＡ-Ｚ０-９々〆〤ヶa-z0-9A-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ.;,/:&()-‘’'‘’]/u

const staffNameRegex =
  /[^一-龠ぁ-ゔァ-ヴーａ-ｚＡ-Ｚ々〆〤ヶa-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹý‘’'‘’]/u
// 。、（）＆ー＋；：

const scaleRegex =
  /[^一-龠ぁ-ゔァ-ヴーａ-ｚＡ-Ｚ０-９々〆〤ヶa-z0-9A-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ.,/:;+&()]/u

export const contractNumberRegex =
  /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹý0-9+\-_/\.]{1,}(\s[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹý0-9+\-_/\.]{1,})*$/

export const abbreviationRegex =
  /^[0-9a-zA-Z\-\/\*\.\.]*[0-9a-zA-Z\-\/\*\.\.]+[0-9a-zA-Z\-\/\*\.\.]*$/

Yup.addMethod(
  Yup.string,
  'customerNameValidation',
  function (errorMessage: string) {
    return this.test(`test-partner-name`, errorMessage, function (value) {
      return !customerPartnerNameRegex.test(
        value?.replaceAll(' ', '')?.replaceAll('　', '') as string
      )
    })
  }
)

Yup.addMethod(Yup.string, 'scaleValidation', function (errorMessage: string) {
  return this.test(`test-scale`, errorMessage, function (value) {
    const _valFlat = replaceChars(value || '', {
      ' ': '',
      '　': '',
      '-': '',
    }) as string
    return !scaleRegex.test(_valFlat)
  })
})

Yup.addMethod(
  Yup.string,
  'projectNameValidation',
  function (errorMessage: string) {
    return this.test(`test-project-name`, errorMessage, function (value) {
      const flatValue = value
        ?.replaceAll(' ', '')
        ?.replaceAll('　', '') as string
      return !projectNameRegex.test(flatValue)
    })
  }
)
Yup.addMethod(Yup.string, 'emailValidation', function (errorMessage: string) {
  return this.test(`test-project-name`, errorMessage, function (value) {
    const flatValue = value?.trim() as string
    if (!flatValue) return true
    return emailRegex.test(flatValue)
  })
})
Yup.addMethod(Yup.string, 'specialCharacters', function (errorMessage: string) {
  return this.test(`test-staff-email`, errorMessage, function (value) {
    const flatValue = value?.trim() as string
    return specialCharacters.test(flatValue)
  })
})

Yup.addMethod(
  Yup.string,
  'staffNameValidation',
  function (errorMessage: string) {
    return this.test(`test-staff-name`, errorMessage, function (value) {
      const flatValue = value
        ?.replaceAll(' ', '')
        ?.replaceAll('　', '') as string
      return !staffNameRegex.test(flatValue)
    })
  }
)

Yup.addMethod(Yup.object, 'objectEmpty', function (errorMessage: string) {
  return this.test(`customer-test`, errorMessage, function (value) {
    const { path, createError } = this
    if (value === null) return false
    return !value || !Object.keys(value).length
      ? createError({ path, message: errorMessage })
      : true
  })
})

Yup.addMethod(Yup.string, 'textRequired', function (errorMessage: string) {
  return this.test(`test-text-required`, errorMessage, function (value) {
    return (value?.toString()?.length as number) > 0 && value?.trim() !== ''
  })
})

export default Yup
