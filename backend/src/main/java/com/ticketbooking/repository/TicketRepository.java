package com.ticketbooking.repository;

import com.ticketbooking.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByCustomerEmail(String customerEmail);
    List<Ticket> findByEventName(String eventName);
}
