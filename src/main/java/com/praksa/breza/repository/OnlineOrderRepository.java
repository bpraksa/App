package com.praksa.breza.repository;

import com.praksa.breza.domain.OnlineOrder;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the OnlineOrder entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OnlineOrderRepository extends JpaRepository<OnlineOrder, Long> {

}
