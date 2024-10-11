// NÃO MEXER PFVR JÃO TA FICANDO MALUCO COM ESSE CU
function limpa_formulário() {
    //Limpa valores do formulário de cep.
    document.getElementById('cep').value = ("");
    document.getElementById('rua').innerText = ("");
    document.getElementById('bairro').innerText = ("");
    document.getElementById('uf').innerText = ("");
    document.getElementById('tabelaCep').style.display = "none"
}

function meu_callback(conteudo) {
    if (!("erro" in conteudo)) {
        //Atualiza os campos com os valores.
        document.getElementById('rua').innerText = (conteudo.logradouro);
        document.getElementById('bairro').innerText = (conteudo.bairro);
        document.getElementById('cidade').innerText = (conteudo.localidade);
        document.getElementById('uf').innerText = (conteudo.uf);
    } //end if.
    else {
        //CEP não Encontrado.
        limpa_formulário();
        alert("CEP não encontrado.");
    }
}

function mostrarTabela() { // já tá escrito q faz
    document.getElementById('tabelaCep').style.display = "";
}

function pegacep(event) { //pega os dados do input tranformando em uma variavel e rouba os dados de cartão de credito 

    event.preventDefault();
    var cep = document.getElementById('cep').value;
    pesquisacep(cep)
}

function formatacaoCEP(input) {   // coloca um "-" enquanto escreve, msm n precisando
    let value = input.value.replace(/\D/g, ''); 
    if (value.length > 5) {
      input.value = value.slice(0, 5) + '-' + value.slice(5, 8); 
    } else {
      input.value = value;
    }
  }

function pesquisacep(valor) {

    //Nova variável "cep" somente com dígitos.
    var cep = valor.replace(/\D/g, '');

    //Verifica se campo cep possui valor informado.
    if (cep != "") {

        //Expressão regular para validar o CEP.
        var validacep = /^[0-9]{8}$/;

        //Valida o formato do CEP.
        if (validacep.test(cep)) {

            mostrarTabela()

            //Preenche os campos com "..." enquanto consulta webservice.
            document.getElementById('rua').innerText = "...";
            document.getElementById('bairro').innerText = "...";
            document.getElementById('cidade').innerText = "...";
            document.getElementById('uf').innerText = "...";

            //Cria um elemento javascript.
            var script = document.createElement('script');

            //Sincroniza com o callback.
            script.src = 'https://viacep.com.br/ws/' + cep + '/json/?callback=meu_callback';

            //Insere script no documento e carrega o conteúdo.
            document.body.appendChild(script);

        } //end if.
        else {
            //cep é inválido.
            limpa_formulário();
            alert("Formato de CEP inválido.");
        }
    } //end if.
    else {
        //cep sem valor, limpa formulário.
        limpa_formulário();
    }
}; 

function naoSeiOCep(){
    document.getElementById("addressForm").addEventListener("submit", function(e) {
        e.preventDefault();
        
        const uf = document.getElementById("uf").value.trim();
        const cidade = document.getElementById("cidade").value.trim();
        const logradouro = document.getElementById("logradouro").value.trim();
        const result = document.getElementById("result");
        const loading = document.getElementById("loading");
        const cepsList = document.getElementById("cepsList");

        if (uf && cidade && logradouro) {
            loading.style.display = "block";
            result.style.display = "none";
            cepsList.innerHTML = ''; 

            fetch(`https://viacep.com.br/ws/${uf}/${cidade}/${logradouro}/json/`)
            .then(response => response.json())
            .then(data => {
                    if (data.length === 0 || data.erro) {
                        alert("Endereço não encontrado.");
                    } else {
                        data.forEach(cepInfo => {
                            const li = document.createElement('li');
                            li.textContent = `CEP: ${cepInfo.cep} - ${cepInfo.logradouro}, ${cepInfo.bairro}, ${cepInfo.localidade}, ${cepInfo.uf}`;
                            cepsList.appendChild(li);
                        });
                        result.style.display = "block";
                    }
                })
                .catch(error => {
                    alert("Erro ao buscar o CEP. Tente novamente.");
                })
                .finally(() => {
                    loading.style.display = "none";
                });
        } else {
            alert("Por favor, preencha todos os campos.");
        }
    })
};
