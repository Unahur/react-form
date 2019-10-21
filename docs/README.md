# Mejores prácticas para la experiencia de usuario en formularios utilizando react

Los formularios son uno de los componentes más importantes en las páginas web. Son la forma en la que los usuarios interaccionan y se comunican.

Vamos a crear un componente en React llamado Form que nos permitirá crear formularios siguiendo las reglas básicas de Usabilidad Web, según las recomendaciones de [Nielsen Norman group](https://www.nngroup.com/articles/web-form-design/) que vimos en la primer [clase](https://unahur.github.io/ciu/#/00-intro/heuristica)

## 8 tips de Usabilidad Web para formularios

Las mejores prácticas que seguiremos para crear nuestros formularios son las siguientes:

1. Los **labels** deben posicionarse alineados y arriba del **input**
    Con los **labels** en esa posición, los formularios son completados a una velocidad mucho más alta.
2. Los **labels** no deben estar completamente en mayúsculas
    El texto que está escrito completamente en mayúsculas es mucho más difícil de leer y escanear.
3. No utilices **placeholders** en lugar de **labels**
    Utilizar **placeholders** en lugar de labels dificulta a los usuarios recordar que información pertenece a que campo, provocando que sea difícil verificar y arreglar errores.
4. Coloca los **checkboxes** y radios uno debajo de otro
    Acomodarlo de esta forma, permite escanearlos más fácilmente.
5. Provee **errores** muy visibles y específicos
    Mostrar los **errores** en un color que resalte y en negritas, asegura que el usuario no los pase por alto.
6. No empieces a **validar** el campo mientras el usuario sigue escribiendo
    Aquí puede haber excepciones, por ejemplo cuando el usuario escribe una contraseña es mejor empezar a validar mientras la escribe.
7. Relaciona los **campos** con el tamaño de la información que esperas.
    El largo de los **campos** ofrece ayuda significativa al usuario para responder las preguntas efectivamente.
8. Haz una clara distinción entre **campos opcionales** y **requeridos**.
   Asegurarse de que el usuario sepa exactamente cuales campos son requeridos, no debería estarlo descubriendo a prueba y error.

## Iniciando el proyecto

Vamos a crear un proyecto como hicimos la clase anterior usando el comando create-react-app. Esta guía esta escrita en forma resumida, asumiendo que ya hiciste el proyecto de la clase anterior. En caso que necesites ayuda, podes guiarte por el código del repositorio que encontrás al final de este documento.

```bash
npx create-react-app react-form
```

Esto nos va a brindar la estructura básica que nuestra app necesita para funcionar.
A diferencia de la clase anterior, vamos a incluir bootstrap mediante react-bootstrap. 
**React-Bootstrap** reemplaza la versión JavaScript de Bootstrap, donde cada componente ha sido construido desde cero como un verdadero componente React, sin dependencias innecesarias como jQuery.

La documentación de react-bootstrap la encontrás [acá](https://react-bootstrap.netlify.com/components/forms/#forms-controls)

## El component Form

Ahora que tenemos definimos buenas prácticas en usabilidad de formularios, vamos a crear un componente llamado Form que las siga. Este formulario recibirá como parámetro un json con los campos a mostrar y funciones a ejecutar.

Comencemos por el componente Form.js

```react
<Form
  title='Inicia Sesion'
  onSubmitLabel='Inicia Sesion'
  onSubmit={onSubmit}
  fields={fields}
/>
```

En el campo fields, el componente Form debe recibir un array de JSON con los siguientes campos

```json
[
 {
  name:<string>, //Identificador del campo, debe ser unico
  label:<string>, //Label que aparecera en el formulario
  type:<string>, //tipo de campo (number, text, email, select, etc)
  helpText:<string>, //Texto de ayuda
  validate: <function>// Función para validar el campo. Se ejecuta  
                      // cuando el usuario deja el campo (onBlur)
                      // Debe regresar un estatus
                      // (error/sucess) y un mensaje
                      //
  validateOnChange: <function> // Función para validar el campo
                      // Se ejecuta cada que el usuario escribe
                      // algo nuevo (onChange)  
  size: <number> // Tamaño del campo (1-12)
  options: <json>//Opciones (Solo para Selects, radios y checkboxes)
 }
]
```

El resultado de este formulario se vería así:

![formulario](https://miro.medium.com/max/1382/1*Xis2HXLleT0TLdPCmNPQFw.png)

Para este formulario existen 2 tipos de validaciones. Para el campo Correo electrónico utilizamos la función validate, que realiza la validación hasta que el usuario haya dejado el *campo(onBlur*) y para la Contraseña utilizamos la función *validateOnChange* que valida el campo cada que el usuario teclea una nueva letra (Mejor práctica#6)

![formulario validado](https://miro.medium.com/max/1334/1*ovl2UbaBGBgiSj-1dS3AEw.png)

Vamos a ver como se crea el formulario dentro de la clase Form.

```react
render() {

    var fields = this.fields.map( field =>{
      return this.getField(field);
    });

    return (
      <form className="form-container">
        <h1>{this.title}</h1>
          <Row>
            {fields}
          </Row>
          <button
            className="btn"
            onClick={this.onSubmit.bind(this.state.formData)}>
            {this.actionLabel}
          </button>
      </form>
    );
  }
```

En la función ***getField***, dependiendo del tipo de campo, creamos el componente y le pasamos en los props toda la información que necesita

```react
getField(field){
    var htmlField = '';

    switch(field.type) {
      case 'select':
        htmlField = (
          <Select
            key={field.name}
            className={this.getInputClass(field.name)}
            label={field.label}
            name={field.name}
            options={field.options}
            onChange={this.handleChange.bind(this, field)}
            validate={this.validate.bind(this, field.name, field.validate)}
            helpText={field.helpText}
            size={field.size}
            error={this.getErrors(field.name)}
          />)
          break;
      case 'textarea':
          ....
      default:
        htmlField = (
          <Input
            key={field.name}
            className={this.getInputClass(field.name)}
            label={field.label}
            name={field.name}
            value={this.getValue(field.name)}
            type={field.type}
            onChange={this.handleChange.bind(this, field)}
            validate={this.validate.bind(this, field.name, field.validate)}
            helpText={field.helpText}
            size={field.size}
            error={this.getErrors(field.name)}
          />
        )
    }

    return htmlField;
  }
  ```

Finalmente llegamos a la clase ***Input***, donde creamos el campo, junto con su label, mensajes de error y textos de ayuda.

```react
import React, {Component} from 'react';
import {Col} from 'react-bootstrap';
import {FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap';

class Input extends Component {

  constructor(props) {
    super(props);

    this.size = this.props.size || 12;
  }


  render() {
    return (
      <Col md={this.size}>
        <FormGroup
          controlId="formBasicText"
          validationState={this.props.error.status}
        >
          <ControlLabel>
            {this.props.label}
            <span className="help-text">
              {this.props.helpText}
            </span>
          </ControlLabel>
          <FormControl
            type={this.props.type}
            value={this.props.value}
            name={this.props.name}
            onChange={this.props.onChange}
            className={this.props.className}
            onBlur={this.props.validate}
          />
          <FormControl.Feedback />
            <HelpBlock>{this.props.error.message}</HelpBlock>
          </FormGroup>
      </Col>
    );
  }
}

export default Input
```

El component Form esta configurado para poder crear un formulario con inputs de diferentes tamaños y así tener la relación entre el tamaño y la información que esperas (mejor práctica#7)
Para crear este formulario

![formulario de pago](https://miro.medium.com/max/1328/1*__-p7cGXulsHwS8bZ_brPg.png)

Utilizaríamos este JSON

```react
var formBilling = {
      title:'Actualiza tu información de pago',
      button:{
        label:'Actualizar forma de pago',
        onSubmit: (event, values) => {
          event.preventDefault();
          console.log('values', values);
        }
      },
      fields:[{
          name:'name',
          label:'Nombre',
          type:'text',
          helpText:'Debe coincidir con la tarjeta',
          size:6,
          validate: value =>{
            var isValid = {status:'success', message:''};
            return isValid;
          }
        }
        ,{
          name:'card',
          label:'Número de tarjeta',
          type:'number',
          helpText:'',
          validateOnChange:value => {
            var isValid = {status:'success', message:''};
            return isValid;
          }
        },{
          name:'expireMonth',
          label:'Fecha de vencimiento',
          type:'select',
          options:[
            {label:'Ene (01)', value:'1'},
            ...
            {label:'Dic (12)', value:'12'},
          ],
          helpText:'Mes',
          size:4,
          validateOnChange:value => {
            var isValid = {status:'success', message:''};
            return isValid;
          }
        },{
          name:'expireYear',
          label:'',
          type:'select',
          options:[
            {label:'2017', value:'2017'},
            ...
            {label:'2028', value:'2028'},
          ],
          helpText:'Año',
          size:3,
          validateOnChange:value => {
            var isValid = {status:'success', message:''};
            return isValid;
          }
        },{
          name:'code',
          label:'Código de seguridad',
          type:'number',
          helpText:'',
          size:3,
          validate: value => {
            var isValid = {status:'success', message:''};

            if(value.length != 3){
              isValid.status = 'error';
              isValid.message = 'El codigo de seguridad debe tener de 3 digitos';
            }
            return isValid;
          }
        }
      ]
    }
```

El código del ejemplo esta [acá](https://github.com/Unahur/react-form)

Personaliza el formulario, hace que se vea como te guste siguiendo las mejores prácticas de usabilidad indicadas.

## Recursos

Que hago si mi aplicación no funciona? Miro el log, y releo la documentación:

* Documentación de react.org sobre [**formularios**](https://es.reactjs.org/docs/forms.html)
* Documentación sobre [**react bootstrap**](https://react-bootstrap.netlify.com/components/forms/)
