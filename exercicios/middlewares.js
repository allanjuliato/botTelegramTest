// middleware pattern or chain of responsibility
const exec = (ctx, ...middlewares) => {                     // A função exec não é um Middle e sim a função que ira executar todos os middles
    const run = index => {                                  // A função run ela ira receber o middle que ele ira executar naquele momento o middle sera alocado no index
        middlewares && index < middlewares.length &&        // Aqui verificamos se a Array de middles existe e se existe não é maior que o tamanho da array
            middlewares[index] (ctx, () => run(index +1))   // Aqui ele passa o a array de middle com o index do middle e ai ele passa o ctx e uma função do index + 1)
    }    
    run(0)                                                  // Ele chama a função run com o indece 0                                                  
}

const mid1 = (ctx, next) => {                               //
    ctx.info1 = 'mid1'                                      // Ele apenas adiciona ao objeto uma informação     
    next()                                                  //    
}

const mid2 = (ctx, next) => {                               //
    ctx.info2 = 'mid2'                                      // Ele apenas adiciona ao objeto uma informação    
    next()                                                  //
}

const mid3 = ctx => ctx.info3 = 'mid3'                     // Ele adiciona uma informação mas não chama a proxima função parando por ai a corrente de middles

const ctx = {}                                             // Declara que a Array ctx
exec(ctx, mid1, mid2, mid3)                                // Chama a Função exec e passa os paramentros

console.log(ctx)                                           // Imprimi o valor dos objeto ctx