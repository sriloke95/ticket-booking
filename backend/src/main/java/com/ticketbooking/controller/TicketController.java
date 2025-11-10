package com.ticketbooking.controller;

import com.ticketbooking.entity.Ticket;
import com.ticketbooking.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {
    
    @Autowired
    private TicketRepository ticketRepository;
    
    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        Optional<Ticket> ticket = ticketRepository.findById(id);
        return ticket.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Ticket createTicket(@RequestBody Ticket ticket) {
        return ticketRepository.save(ticket);
    }
    
    @GetMapping("/event/{eventName}")
    public List<Ticket> getTicketsByEvent(@PathVariable String eventName) {
        return ticketRepository.findByEventName(eventName);
    }
    
    @GetMapping("/email/{email}")
    public List<Ticket> getTicketsByEmail(@PathVariable String email) {
        return ticketRepository.findByCustomerEmail(email);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTicket(@PathVariable Long id) {
        if (ticketRepository.existsById(id)) {
            ticketRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
