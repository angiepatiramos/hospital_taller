package com.example.senaHospital.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.senaHospital.interfaceService.IMedicoService;
import com.example.senaHospital.interfaces.IMedico;
import com.example.senaHospital.models.medico;

@Service
public class medicoService implements IMedicoService {

    @Autowired
    private IMedico data;

    @Override
    public String save(medico medico) {
        data.save(medico);
        return medico.getId();
    }

    @Override
    public List<medico> findAll() {
        List<medico> listaMedico = (List<medico>) data.findAll();
        
        return listaMedico;
    }
    @Override
	public List<medico> filtroMedico(String filtro) {
		List <medico> listaMedico=data.filtroMedico(filtro);
		return listaMedico;
	}

    @Override
    public Optional<medico> findOne(String id) {
        Optional<medico> medico = data.findById(id);
        
        return medico;
    }

    @Override
    public int delete(String id) {
        data.deleteById(id);
        return 1;
    }

}
