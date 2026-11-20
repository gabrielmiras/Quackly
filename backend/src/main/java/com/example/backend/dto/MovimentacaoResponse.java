package com.example.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class MovimentacaoResponse {

    private Long idMovimentacao;

    private Long idUsuario;

    private String tipoMovimentacao;

    private BigDecimal valor;

    private String nome;

    private LocalDateTime data;
}
