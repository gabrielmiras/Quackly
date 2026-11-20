package com.example.backend.service;

import com.example.backend.dto.MovimentacaoRequest;
import com.example.backend.dto.MovimentacaoResponse;
import com.example.backend.model.Movimentacao;
import com.example.backend.model.Usuario;
import com.example.backend.repository.MovimentacaoRepository;
import com.example.backend.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovimentacaoService {

    @Autowired
    private MovimentacaoRepository movimentacaoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Converter entidade para DTO de resposta
    private MovimentacaoResponse converterParaResponse(Movimentacao movimentacao) {
        MovimentacaoResponse response = new MovimentacaoResponse();

        response.setIdMovimentacao(movimentacao.getIdMovimentacao());
        response.setIdUsuario(movimentacao.getUsuario().getId());
        response.setTipoMovimentacao(movimentacao.getTipoMovimentacao());
        response.setValor(movimentacao.getValor());
        response.setNome(movimentacao.getNome());
        response.setData(movimentacao.getData());

        return response;
    }

    // GET — listar movimentações de um usuário
    public List<MovimentacaoResponse> listarPorUsuario(Long idUsuario) {

        if (!usuarioRepository.existsById(idUsuario)) {
            throw new IllegalArgumentException("Usuário não encontrado.");
        }

        return movimentacaoRepository.findByUsuarioId(idUsuario)
                .stream()
                .map(this::converterParaResponse)
                .toList();
    }

    // POST — cadastrar movimentação
    public MovimentacaoResponse salvar(MovimentacaoRequest request) {

        validarRequest(request);

        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        Movimentacao movimentacao = new Movimentacao();

        movimentacao.setUsuario(usuario);
        movimentacao.setTipoMovimentacao(request.getTipoMovimentacao());
        movimentacao.setValor(request.getValor());
        movimentacao.setNome(request.getNome());
        movimentacao.setData(request.getData());

        Movimentacao salva = movimentacaoRepository.save(movimentacao);

        return converterParaResponse(salva);
    }

    // Validar os dados recebidos
    private void validarRequest(MovimentacaoRequest request) {

        if (request.getIdUsuario() == null) {
            throw new IllegalArgumentException("O ID do usuário é obrigatório.");
        }

        if (!"Entrada".equals(request.getTipoMovimentacao())
                && !"Saida".equals(request.getTipoMovimentacao())) {
            throw new IllegalArgumentException("Tipo deve ser Entrada ou Saida.");
        }

        if (request.getValor() == null || request.getValor().signum() <= 0) {
            throw new IllegalArgumentException("O valor deve ser maior que zero.");
        }

        if (request.getNome() == null || request.getNome().isBlank()) {
            throw new IllegalArgumentException("O nome é obrigatório.");
        }

        if (request.getData() == null) {
            throw new IllegalArgumentException("A data e hora são obrigatórias.");
        }
    }

    // GET — buscar movimentação específica de um usuário
    public MovimentacaoResponse buscarPorId(Long idMovimentacao, Long idUsuario) {

        Movimentacao movimentacao = movimentacaoRepository
                .findByIdMovimentacaoAndUsuarioId(idMovimentacao, idUsuario)
                .orElseThrow(() -> new IllegalArgumentException("Movimentação não encontrada."));

        return converterParaResponse(movimentacao);
    }

    // PUT — atualizar movimentação de um usuário
    public MovimentacaoResponse atualizar(
            Long idMovimentacao,
            Long idUsuario,
            MovimentacaoRequest request) {

        validarRequest(request);

        Movimentacao existente = movimentacaoRepository
                .findByIdMovimentacaoAndUsuarioId(idMovimentacao, idUsuario)
                .orElse(null);

        if (existente == null) {
            return null;
        }

        if (!idUsuario.equals(request.getIdUsuario())) {
            throw new IllegalArgumentException(
                    "A movimentação não pertence a esse usuário."
            );
        }

        existente.setTipoMovimentacao(request.getTipoMovimentacao());
        existente.setValor(request.getValor());
        existente.setNome(request.getNome());
        existente.setData(request.getData());

        Movimentacao atualizada = movimentacaoRepository.save(existente);

        return converterParaResponse(atualizada);
    }

    // DELETE — excluir movimentação de um usuário
    public boolean excluir(Long idMovimentacao, Long idUsuario) {

        Movimentacao movimentacao = movimentacaoRepository
                .findByIdMovimentacaoAndUsuarioId(idMovimentacao, idUsuario)
                .orElse(null);

        if (movimentacao == null) {
            return false;
        }

        movimentacaoRepository.delete(movimentacao);

        return true;
    }
}
